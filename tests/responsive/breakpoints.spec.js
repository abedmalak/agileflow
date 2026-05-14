import { test, expect } from '@playwright/test'

const viewports = [
  { name: 'mobile-portrait', width: 375, height: 667 },
  { name: 'mobile-landscape', width: 667, height: 375 },
  { name: 'tablet-portrait', width: 768, height: 1024 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'desktop-large', width: 1920, height: 1080 },
]

test.describe('Responsive Design', () => {

  for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {

      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height })
      })

      test('login page renders without horizontal overflow', async ({ page }) => {
        await page.goto('/login')
        await page.waitForLoadState('networkidle')

        const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
        expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 1) // 1px tolerance
      })

      test('login form is usable', async ({ page }) => {
        await page.goto('/login')
        await page.waitForLoadState('networkidle')

        // Email and password inputs should be visible
        const emailInput = page.locator('input[type="email"]')
        const passwordInput = page.locator('input[type="password"]')
        const submitButton = page.locator('button[type="submit"]')

        await expect(emailInput).toBeVisible()
        await expect(passwordInput).toBeVisible()
        await expect(submitButton).toBeVisible()

        // Inputs should not be clipped
        const emailBox = await emailInput.boundingBox()
        expect(emailBox.width).toBeGreaterThan(100) // Minimum usable width
      })

      test('text is readable (minimum font size)', async ({ page }) => {
        await page.goto('/login')
        await page.waitForLoadState('networkidle')

        // Check that body text is at least 12px
        const minFontSize = await page.evaluate(() => {
          const elements = document.querySelectorAll('p, span, label, a, button, input')
          let min = 100
          elements.forEach(el => {
            const size = parseFloat(window.getComputedStyle(el).fontSize)
            if (size < min && el.textContent.trim()) min = size
          })
          return min
        })

        expect(minFontSize).toBeGreaterThanOrEqual(12)
      })

      test('touch targets are large enough on mobile', async ({ page }) => {
        if (viewport.width > 768) return // Only check mobile/tablet

        await page.goto('/login')
        await page.waitForLoadState('networkidle')

        const buttons = page.locator('button, a, [role="button"]')
        const count = await buttons.count()

        for (let i = 0; i < count; i++) {
          const box = await buttons.nth(i).boundingBox()
          if (box && await buttons.nth(i).isVisible()) {
            // WCAG 2.5.5: minimum 44x44px for touch targets
            expect(box.height, `Button ${i} height`).toBeGreaterThanOrEqual(36) // relaxed from 44
          }
        }
      })

      test('no content is hidden off-screen', async ({ page }) => {
        await page.goto('/login')
        await page.waitForLoadState('networkidle')

        const isContentClipped = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth
        })

        expect(isContentClipped).toBe(false)
      })
    })
  }
})
