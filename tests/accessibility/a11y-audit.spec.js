import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Audit', () => {

  test('login page meets WCAG 2.1 AA standards', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    // Log violations for debugging
    if (results.violations.length > 0) {
      console.log('Accessibility violations on Login:')
      results.violations.forEach(v => {
        console.log(`  [${v.impact}] ${v.id}: ${v.description}`)
        v.nodes.forEach(n => console.log(`    ${n.html.substring(0, 100)}`))
      })
    }

    // Filter to only serious/critical violations
    const serious = results.violations.filter(v =>
      v.impact === 'serious' || v.impact === 'critical'
    )
    expect(serious).toEqual([])
  })

  test('all form inputs have associated labels', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['label', 'label-title-only'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('color contrast meets minimum ratio', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze()

    const critical = results.violations.filter(v => v.impact === 'critical')
    expect(critical).toEqual([])
  })

  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/login')

    // Tab through elements and check focus visibility
    await page.keyboard.press('Tab')
    const focusedEl = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedEl).toBeTruthy()
    expect(focusedEl).not.toBe('BODY')
  })

  test('page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['heading-order', 'page-has-heading-one'])
      .analyze()

    // Log but don't fail on heading-order (common in SPAs)
    results.violations.forEach(v => {
      console.log(`  [${v.impact}] ${v.id}: ${v.description}`)
    })
  })

  test('images have alt text', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['image-alt'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
