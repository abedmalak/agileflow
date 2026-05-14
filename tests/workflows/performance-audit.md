# Performance Audit Workflow

How to run performance checks on the AgileFlow app, covering bundle analysis, Lighthouse metrics, and runtime performance.

## Prerequisites
- Node.js installed
- Dependencies installed (`npm install`)
- Chrome available (for Lighthouse / DevTools MCP)

## Step 1: Build Production Bundle

```bash
npm run build
```

Check the build output for:
- Total bundle size (Vite reports this after build)
- Individual chunk sizes
- Any warnings about large chunks (> 500KB)

### Analyze Bundle Contents
```bash
# Install bundle analyzer if needed
npx vite-bundle-visualizer

# Or check sizes manually
ls -lh dist/assets/*.js | sort -k5 -h
ls -lh dist/assets/*.css | sort -k5 -h
```

### Size Budgets
| Asset Type      | Target     | Warning    | Critical   |
|-----------------|------------|------------|------------|
| Main JS bundle  | < 200KB    | > 300KB    | > 500KB    |
| CSS bundle      | < 50KB     | > 100KB    | > 200KB    |
| Total transfer  | < 500KB    | > 800KB    | > 1.5MB    |
| Individual chunk| < 100KB    | > 200KB    | > 500KB    |

Sizes above are gzipped. Vite reports both raw and gzipped.

## Step 2: Check Bundle for Large Dependencies

Look for oversized dependencies that could be lazy-loaded or replaced:

```bash
# Check which packages contribute most to bundle
npx vite-bundle-visualizer
```

Common optimization targets in this project:
- **Recharts** — Only import used chart types, not the entire library
- **Framer Motion** — Use `LazyMotion` + `domAnimation` for smaller bundle
- **Radix UI** — Already tree-shakeable, should be fine
- **date-fns** — Prefer over moment.js (already used correctly)

## Step 3: Run Lighthouse Audit

### Via Chrome DevTools MCP
If Chrome DevTools MCP is available, use it to run Lighthouse:
```
Use the chrome-devtools MCP to run a Lighthouse audit on http://localhost:5173/Dashboard
```

### Via CLI
```bash
# Preview the production build
npm run preview &

# Run Lighthouse (install globally if needed)
npx lighthouse http://localhost:4173/Dashboard --output=json --output-path=./lighthouse-report.json

# Or for a quick summary
npx lighthouse http://localhost:4173/Dashboard --output=html --view
```

### Key Metrics and Targets

| Metric                          | Target    | Description                              |
|---------------------------------|-----------|------------------------------------------|
| First Contentful Paint (FCP)    | < 1.8s    | Time to first visible content            |
| Largest Contentful Paint (LCP)  | < 2.5s    | Time to largest visible element          |
| Time to Interactive (TTI)       | < 3.8s    | Time until fully interactive             |
| Cumulative Layout Shift (CLS)   | < 0.1     | Visual stability (lower is better)       |
| Total Blocking Time (TBT)       | < 200ms   | Main thread blocking time                |
| Speed Index                     | < 3.4s    | How quickly content is visually rendered |

### Score Targets
| Category        | Target Score |
|-----------------|-------------|
| Performance     | > 90        |
| Accessibility   | > 90        |
| Best Practices  | > 90        |
| SEO             | > 80        |

## Step 4: Check for Unnecessary Re-renders

### Using React DevTools Profiler
1. Install React DevTools browser extension
2. Open the app in development mode (`npm run dev`)
3. Go to React DevTools > Profiler tab
4. Record interactions and look for:
   - Components re-rendering when their props haven't changed
   - Parent re-renders causing all children to re-render
   - Context providers causing wide re-render trees

### Common Re-render Issues in AgileFlow
- **Board.jsx** — Large component tree; item updates shouldn't re-render entire board
- **Dashboard widgets** — Each widget should only re-render when its data changes
- **AuthContext** — Should not cause re-renders on every route change
- **ThemeProvider** — Theme changes should be infrequent, but all consumers re-render

### Fixes
```jsx
// Memoize expensive components
const MemoizedBoardItem = React.memo(BoardItem);

// Memoize expensive computations
const sortedItems = useMemo(() => items.sort(...), [items]);

// Memoize callbacks passed as props
const handleClick = useCallback(() => { ... }, [deps]);
```

## Step 5: Check for Large Dependencies

```bash
# List all dependencies and their sizes
npx cost-of-modules --no-install

# Or check individual packages
npx bundlephobia-cli recharts
npx bundlephobia-cli framer-motion
```

### Optimization Strategies
1. **Code splitting** — Lazy-load routes with `React.lazy()` + `Suspense`
2. **Dynamic imports** — Load heavy components only when needed
3. **Tree shaking** — Import only what you use (`import { BarChart } from 'recharts'`)
4. **Replace heavy deps** — Consider lighter alternatives for large libraries

```jsx
// Lazy load pages
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Admin = React.lazy(() => import('./pages/Admin'));
```

## Step 6: Report Metrics

```
## Performance Audit Report — [date]

### Build
- Total bundle size: XXX KB (gzipped)
- Main JS chunk: XXX KB
- CSS: XXX KB
- Largest chunk: XXX KB ([name])

### Lighthouse Scores
- Performance: XX
- Accessibility: XX
- Best Practices: XX
- SEO: XX

### Core Web Vitals
- FCP: X.Xs (target: < 1.8s)
- LCP: X.Xs (target: < 2.5s)
- TTI: X.Xs (target: < 3.8s)
- CLS: X.XX (target: < 0.1)
- TBT: XXXms (target: < 200ms)

### Large Dependencies
| Package        | Size (minified) | Suggestion          |
|----------------|-----------------|---------------------|
| recharts       | XXX KB          | Lazy load           |
| framer-motion  | XXX KB          | Use LazyMotion      |

### Re-render Issues
- [component]: [issue description]

### Recommendations
1. [highest impact optimization]
2. [next priority]
3. [...]
```
