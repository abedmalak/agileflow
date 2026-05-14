import { test, expect } from '@playwright/test'

// Helper: attempt login if redirected to login page
async function ensureAuthenticated(page) {
  const testEmail = process.env.TEST_USER_EMAIL
  const testPassword = process.env.TEST_USER_PASSWORD

  const isLoginPage = await page
    .locator('input[type="email"]')
    .isVisible({ timeout: 5000 })
    .catch(() => false)

  if (!isLoginPage) return true

  if (!testEmail || !testPassword) {
    return false
  }

  await page.fill('input[type="email"]', testEmail)
  await page.fill('input[type="password"]', testPassword)
  await page.click('button[type="submit"]')

  await page.waitForURL((url) => !url.pathname.includes('login'), { timeout: 10000 }).catch(() => {})

  return !page.url().includes('login')
}

test.describe('Navigation', () => {
  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/')
    // Should either show login page or redirect to /login
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toBeVisible({ timeout: 10000 })
  })

  test('Dashboard page loads', async ({ page }) => {
    await page.goto('/Dashboard')
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Dashboard')
    await page.waitForLoadState('networkidle')

    // Dashboard should have content (heading, widgets, etc.)
    const content = page.locator('h1, h2, [class*="dashboard"]').first()
    await expect(content).toBeVisible({ timeout: 10000 })
  })

  test('Boards page loads', async ({ page }) => {
    await page.goto('/Boards')
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Boards')
    await page.waitForLoadState('networkidle')

    const content = page.locator('h1, h2, button:has-text("New Board"), button:has-text("Create")').first()
    await expect(content).toBeVisible({ timeout: 10000 })
  })

  test('Backlog page loads', async ({ page }) => {
    await page.goto('/Backlog')
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Backlog')
    await page.waitForLoadState('networkidle')

    const content = page.locator('h1, h2, [class*="backlog"]').first()
    await expect(content).toBeVisible({ timeout: 10000 })
  })

  test('Calendar page loads', async ({ page }) => {
    await page.goto('/Calendar')
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Calendar')
    await page.waitForLoadState('networkidle')

    const content = page.locator('h1, h2, [class*="calendar"]').first()
    await expect(content).toBeVisible({ timeout: 10000 })
  })

  test('Analytics page loads', async ({ page }) => {
    await page.goto('/Analytics')
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Analytics')
    await page.waitForLoadState('networkidle')

    const content = page.locator('h1, h2, [class*="analytics"], [class*="chart"]').first()
    await expect(content).toBeVisible({ timeout: 10000 })
  })

  test('Settings page loads', async ({ page }) => {
    await page.goto('/Settings')
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Settings')
    await page.waitForLoadState('networkidle')

    const content = page.locator('h1, h2, text=Settings').first()
    await expect(content).toBeVisible({ timeout: 10000 })
  })

  test('navigation sidebar contains main links', async ({ page }) => {
    await page.goto('/')
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Dashboard')
    await page.waitForLoadState('networkidle')

    // The Layout sidebar should have these nav items
    const navLinks = ['Dashboard', 'Boards', 'Backlog', 'Calendar', 'Analytics']

    for (const label of navLinks) {
      const link = page.locator(`a:has-text("${label}"), [role="link"]:has-text("${label}")`).first()
      await expect(link).toBeVisible({ timeout: 10000 })
    }
  })

  test('clicking navigation links changes the page', async ({ page }) => {
    await page.goto('/')
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Dashboard')
    await page.waitForLoadState('networkidle')

    // Click on Boards nav link
    const boardsLink = page.locator('a:has-text("Boards")').first()
    await boardsLink.click()

    await page.waitForURL('**/Boards', { timeout: 10000 })
    expect(page.url()).toContain('/Boards')
  })

  test('invalid route shows 404 or redirects', async ({ page }) => {
    await page.goto('/NonExistentPage')

    // Should either show a 404 page, redirect to login, or redirect to dashboard
    await page.waitForLoadState('networkidle')

    const url = page.url()
    const is404 = await page.locator('text=404, text=Not Found, text=not found').first().isVisible().catch(() => false)
    const isLogin = url.includes('login')
    const isHome = url.endsWith('/') || url.includes('Dashboard')

    // One of these should be true
    expect(is404 || isLogin || isHome).toBeTruthy()
  })
})
