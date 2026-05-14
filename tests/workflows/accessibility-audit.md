# Accessibility Audit Workflow

Complete guide for running an accessibility audit on the AgileFlow app using axe-core via Playwright.

## Prerequisites
- Dev server running (`npm run dev`)
- `@axe-core/playwright` installed (in devDependencies)
- Playwright browsers installed (`npx playwright install`)

## Pages to Test

All 10 application pages must be audited:

| # | Page           | Route                  | Key Elements to Check                     |
|---|----------------|------------------------|-------------------------------------------|
| 1 | Login          | `/login`               | Form labels, error messages, focus mgmt   |
| 2 | Dashboard      | `/Dashboard`           | Widget headings, chart alt text, links    |
| 3 | Boards List    | `/Boards`              | Card interactions, create button          |
| 4 | Board Detail   | `/Board?id=<id>`       | Kanban DnD, column headers, item cards    |
| 5 | Backlog        | `/Backlog`             | Sprint sections, story cards, drag items  |
| 6 | Calendar       | `/Calendar`            | Date navigation, event creation, modals   |
| 7 | Analytics      | `/Analytics`           | Chart descriptions, data tables, filters  |
| 8 | Settings       | `/Settings`            | Form fields, toggles, save buttons        |
| 9 | Admin          | `/Admin`               | Admin controls, user management tables    |
|10 | Performance    | `/Performance`         | Metrics display, monitoring widgets       |

## Standard: WCAG 2.1 Level AA

Key requirements:
- **Perceivable**: Text alternatives, captions, adaptable content, distinguishable colors
- **Operable**: Keyboard accessible, enough time, no seizure triggers, navigable
- **Understandable**: Readable, predictable, input assistance
- **Robust**: Compatible with assistive technologies

## Running the Audit

### Full Audit
```bash
npm run test:a11y
```

### Individual Page (modify test file or run with grep)
```bash
npx playwright test tests/accessibility/a11y-audit.spec.js -g "Dashboard"
```

## Interpreting Violations

axe-core returns violations as an array. Each violation contains:

```json
{
  "id": "color-contrast",
  "impact": "serious",
  "description": "Ensures the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds",
  "help": "Elements must meet minimum color contrast ratio thresholds",
  "helpUrl": "https://dequeuniversity.com/rules/axe/4.x/color-contrast",
  "nodes": [
    {
      "target": ["#submit-button"],
      "html": "<button id=\"submit-button\" class=\"...\">Submit</button>",
      "failureSummary": "Fix any of the following: Element has insufficient color contrast of 2.5:1..."
    }
  ]
}
```

Group violations by impact level and address in order:

### Critical (must fix)
| Rule ID                  | Description                                | Common Fix                              |
|--------------------------|--------------------------------------------|-----------------------------------------|
| `aria-required-attr`     | ARIA role missing required attributes      | Add required ARIA attrs                 |
| `button-name`            | Button has no accessible name              | Add text content or `aria-label`        |
| `image-alt`              | Image missing alt text                     | Add `alt` attribute                     |
| `input-image-alt`        | Image input missing alt                    | Add `alt` attribute                     |

### Serious (should fix)
| Rule ID                  | Description                                | Common Fix                              |
|--------------------------|--------------------------------------------|-----------------------------------------|
| `color-contrast`         | Insufficient color contrast                | Adjust foreground/background colors     |
| `label`                  | Form element has no label                  | Add `<label>` or `aria-label`           |
| `link-name`              | Link has no accessible name                | Add text content or `aria-label`        |
| `select-name`            | Select has no accessible name              | Add associated `<label>`                |

### Moderate (plan to fix)
| Rule ID                  | Description                                | Common Fix                              |
|--------------------------|--------------------------------------------|-----------------------------------------|
| `heading-order`          | Heading levels skip (e.g., h1 to h3)      | Use sequential heading levels           |
| `landmark-one-main`      | Page lacks `main` landmark                 | Add `<main>` element                    |
| `region`                 | Content not in landmark region             | Wrap in `<main>`, `<nav>`, `<aside>`    |

### Minor (fix when convenient)
| Rule ID                  | Description                                | Common Fix                              |
|--------------------------|--------------------------------------------|-----------------------------------------|
| `landmark-unique`        | Landmarks not uniquely labeled             | Add `aria-label` to landmarks           |
| `meta-viewport`          | Viewport disables zoom                     | Remove `user-scalable=no`              |

## Common Fixes in AgileFlow

### Missing Labels on Inputs
```jsx
// Bad
<Input placeholder="Search..." />

// Good
<label htmlFor="search" className="sr-only">Search</label>
<Input id="search" placeholder="Search..." />

// Or use aria-label
<Input aria-label="Search boards" placeholder="Search..." />
```

### Color Contrast Issues
Use these minimum ratios:
- Normal text (< 18px or < 14px bold): **4.5:1**
- Large text (>= 18px or >= 14px bold): **3:1**
- UI components and graphical objects: **3:1**

Check with: https://webaim.org/resources/contrastchecker/

### Keyboard Navigation
```jsx
// Ensure all interactive elements are focusable
<div onClick={handler} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handler()}>
  Click me
</div>
```

### Charts and Data Visualizations
```jsx
// Recharts: add descriptive content
<div role="img" aria-label="Sprint velocity chart showing 45 points completed this sprint">
  <ResponsiveContainer>
    <BarChart data={data}>...</BarChart>
  </ResponsiveContainer>
</div>
```

## Dark Mode Specific Checks

Run the audit in both light and dark mode. Common dark mode issues:

1. **Contrast regression** — Colors that pass in light mode may fail in dark mode
   - Check `dark:text-*` and `dark:bg-*` class combinations
   - Brand blue `#0073EA` on dark backgrounds needs verification

2. **Focus indicators** — Default focus ring may be invisible on dark backgrounds
   - Ensure `focus:ring-*` classes have adequate contrast in dark mode
   - Add `dark:focus:ring-*` variants if needed

3. **Disabled states** — Disabled elements may become invisible in dark mode
   - Check `dark:disabled:*` styling

4. **SVG/Icon colors** — Icons using `currentColor` should inherit correct dark mode text color
   - Verify Lucide icons are visible in both themes

## Reporting

Produce a structured report:

```
## Accessibility Audit Report — [date]

### Summary
- Pages audited: 10
- Total violations: X
- Critical: X | Serious: X | Moderate: X | Minor: X

### Violations by Page
#### /Dashboard
- [impact] rule-id: description (X elements affected)

#### /Board
- [impact] rule-id: description (X elements affected)

[...for each page]

### Dark Mode Delta
- Additional violations in dark mode: X
- [list differences]

### Recommendations
1. [highest priority fix]
2. [next priority]
3. [...]
```
