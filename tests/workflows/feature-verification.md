# Feature Verification Workflow

Step-by-step process for verifying a newly implemented feature works correctly in the AgileFlow app.

## Prerequisites
- Node.js installed
- Dependencies installed (`npm install`)
- Playwright browsers installed (`npx playwright install`)
- Supabase project running with test data

## Step 1: Identify Changed Files

```bash
# See what files changed (compared to main branch)
git diff --name-only main

# Or see recent changes
git diff --name-only HEAD~1
```

Map changed files to feature areas:
- `src/components/board/` → Board features
- `src/components/backlog/` → Sprint/backlog features
- `src/components/calendar/` → Calendar features
- `src/components/dashboard/` → Dashboard widgets
- `src/api/entities/` → Data layer changes
- `src/lib/` → Core utilities/auth

## Step 2: Run Unit Tests for Changed Modules

```bash
# Run all unit tests
npm run test

# Run specific test file
npx vitest run tests/unit/entities/Board.test.js

# Run with coverage to check changed code is tested
npm run test:coverage
```

**Pass criteria**: All unit tests pass. No regressions in existing tests.

## Step 3: Start Dev Server

```bash
# Start the development server (needed for Playwright tests)
npm run dev

# Verify it's running
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
# Should return 200
```

## Step 4: Run E2e Tests for the Feature Area

```bash
# Run e2e tests related to the feature
npx playwright test tests/e2e/boards.spec.js

# Run all e2e tests if unsure which are relevant
npm run test:e2e

# Run a specific test by name
npx playwright test -g "should create a new board"
```

**Pass criteria**: All e2e tests pass. New feature flows work end-to-end.

## Step 5: Run Accessibility Audit on Affected Pages

```bash
# Run full accessibility audit
npm run test:a11y

# Check specific page (modify test to target one page)
npx playwright test tests/accessibility/a11y-audit.spec.js
```

**Pass criteria**: No new critical or serious axe-core violations introduced.

Check specifically:
- New form inputs have associated labels
- New interactive elements are keyboard accessible
- New images have alt text
- New colors meet WCAG 2.1 AA contrast ratios (4.5:1 normal text, 3:1 large text)

## Step 6: Run Responsive Checks on Affected Pages

```bash
# Run responsive tests
npm run test:responsive
```

Test at these breakpoints:
- **Mobile** (375px): Content readable, no overflow, touch targets >= 44px
- **Tablet** (768px): Layout adapts, sidebars collapse appropriately
- **Desktop** (1280px): Full layout with all panels visible
- **Large Desktop** (1920px): Content doesn't stretch awkwardly

**Pass criteria**: No layout overflow, all content accessible at each breakpoint.

## Step 7: Report Results

Compile results into a summary:

```
Feature: [name]
Changed Files: [count]

Unit Tests:        PASS (X passed, Y failed)
E2e Tests:         PASS (X passed, Y failed)
Accessibility:     PASS (0 new violations)
Responsive:        PASS (all breakpoints clear)
Lint:              PASS
Build:             PASS

Overall: VERIFIED
```

If any step fails:
1. Document the failure with details
2. Fix the issue
3. Re-run the failed step
4. Update the report

## Using the Feature Verifier Agent

Instead of running these steps manually, you can use the `feature-verifier` agent:

```
Use the feature-verifier agent to verify the board filter feature.
Changed files: src/components/board/BoardFilter.jsx, src/pages/Board.jsx
```
