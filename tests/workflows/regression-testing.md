# Regression Testing Workflow

Full regression testing process for the AgileFlow app. Run this before releases, after major merges, or on a regular schedule.

## Prerequisites
- Node.js installed
- Dependencies installed (`npm install`)
- Playwright browsers installed (`npx playwright install`)
- Clean working directory (`git status` shows no unexpected changes)

## Step 1: Run All Unit Tests

```bash
npm run test
```

Expected output: summary showing passed/failed/skipped counts.

```bash
# Optional: run with coverage report
npm run test:coverage
```

Coverage report is generated in `coverage/`. Check that critical paths (entities, auth, utils) have adequate coverage.

**Stop here if unit tests fail** — fix unit test failures before proceeding to integration tests.

## Step 2: Start Dev Server

```bash
# Start in background
npm run dev &

# Wait for server to be ready
sleep 5

# Verify it responds
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
```

## Step 3: Run All E2e Tests

```bash
npm run test:e2e
```

This runs all Playwright specs in `tests/e2e/`. Check for:
- Test count matches expected (no tests accidentally skipped)
- All critical user flows pass (login, create board, manage items, etc.)
- No timeout errors (may indicate performance regression)

Save results for comparison:
```bash
npx playwright test --reporter=json > test-results/e2e-results.json
```

## Step 4: Run Full Accessibility Audit

```bash
npm run test:a11y
```

This runs axe-core scans on all pages via Playwright. Review violations by impact:

| Impact   | Action                     |
|----------|----------------------------|
| Critical | Must fix before release     |
| Serious  | Should fix before release   |
| Moderate | Track as tech debt          |
| Minor    | Fix when convenient         |

Run in both themes:
- Light mode (default)
- Dark mode (toggle via ThemeProvider)

## Step 5: Run Responsive Tests Across All Breakpoints

```bash
npm run test:responsive
```

Breakpoints tested:
- 375px (mobile)
- 768px (tablet)
- 1280px (desktop)
- 1920px (large desktop)

Check for:
- Horizontal overflow on any page
- Content readability
- Touch target sizes on mobile/tablet
- Navigation usability

## Step 6: Generate Test Report

Aggregate all results:

```
## Regression Test Report — [date]

### Unit Tests
- Total: X
- Passed: X
- Failed: X
- Skipped: X
- Coverage: X%

### E2e Tests
- Total: X
- Passed: X
- Failed: X
- Skipped: X

### Accessibility Audit
- Pages scanned: 10
- Violations: X
  - Critical: X
  - Serious: X
  - Moderate: X
  - Minor: X

### Responsive Tests
- Breakpoints tested: 4
- Passed: X
- Failed: X
- Issues: [list affected breakpoints and pages]

### Overall: PASS / FAIL
```

## Step 7: Compare with Previous Results

If previous results exist in `test-results/`:
1. Compare pass/fail counts — any new failures?
2. Check if previously passing tests now fail (true regressions)
3. Check if previously failing tests now pass (fixes confirmed)
4. Note any flaky tests (intermittent pass/fail)

Flag regressions clearly:
```
NEW FAILURES (were passing before):
- tests/e2e/boards.spec.js > "should drag item between columns"
- tests/accessibility/a11y-audit.spec.js > "Settings page has no violations"

FIXED (were failing before):
- tests/unit/entities/Board.test.js > "should filter by status"
```

## Automation

Run the full regression suite with a single command:
```bash
npm run test:all
```

Or use the `regression-tester` agent for an orchestrated run with a formatted report.

## Cleanup

```bash
# Stop dev server
kill $(lsof -ti:5173) 2>/dev/null

# Clean test artifacts (optional)
rm -rf test-results/ playwright-report/
```
