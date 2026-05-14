import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Dark Mode Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    // Set dark mode via prefers-color-scheme
    await page.emulateMedia({ colorScheme: 'dark' })
  })

  test('login page dark mode has adequate contrast', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze()

    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')
    if (critical.length > 0) {
      console.log('Dark mode contrast violations:')
      critical.forEach(v => {
        v.nodes.forEach(n => console.log(`  ${n.html.substring(0, 100)}: ${n.any.map(a => a.message).join(', ')}`))
      })
    }
    expect(critical).toEqual([])
  })
})
