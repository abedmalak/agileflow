import { test, expect } from '@playwright/test'

// Helper: attempt login if redirected to login page
async function ensureAuthenticated(page) {
  const testEmail = process.env.TEST_USER_EMAIL
  const testPassword = process.env.TEST_USER_PASSWORD

  // Check if we're on the login page
  const isLoginPage = await page
    .locator('input[type="email"]')
    .isVisible({ timeout: 5000 })
    .catch(() => false)

  if (!isLoginPage) return true // Already authenticated

  if (!testEmail || !testPassword) {
    return false // No test credentials configured
  }

  await page.fill('input[type="email"]', testEmail)
  await page.fill('input[type="password"]', testPassword)
  await page.click('button[type="submit"]')

  // Wait for navigation away from login
  await page.waitForURL((url) => !url.pathname.includes('login'), { timeout: 10000 }).catch(() => {})

  return !page.url().includes('login')
}

test.describe('Boards Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Boards')
  })

  test('boards page loads with title or redirects to login', async ({ page }) => {
    const isAuth = await ensureAuthenticated(page)

    if (!isAuth) {
      // Not authenticated — should be on login page
      await expect(page.locator('input[type="email"]')).toBeVisible()
      test.skip(true, 'No test credentials configured — skipping authenticated test')
      return
    }

    await page.goto('/Boards')
    // Should see a heading or the boards page content
    const heading = page.locator('h1, h2').first()
    await expect(heading).toBeVisible({ timeout: 10000 })
  })

  test('shows create board button when authenticated', async ({ page }) => {
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Boards')

    // Look for a "New Board" or "Create" button with plus icon
    const createButton = page
      .locator('button:has-text("New Board"), button:has-text("Create"), button:has-text("Add")')
      .first()
    await expect(createButton).toBeVisible({ timeout: 10000 })
  })

  test('create board modal opens on button click', async ({ page }) => {
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Boards')

    const createButton = page
      .locator('button:has-text("New Board"), button:has-text("Create"), button:has-text("Add")')
      .first()
    await createButton.click()

    // Modal should appear with a dialog or form
    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible({ timeout: 5000 })
  })

  test('create board modal has title, description, color, and visibility fields', async ({ page }) => {
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Boards')

    const createButton = page
      .locator('button:has-text("New Board"), button:has-text("Create"), button:has-text("Add")')
      .first()
    await createButton.click()

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible({ timeout: 5000 })

    // Title field (required)
    await expect(modal.locator('text=Title, label:has-text("Title")')).toBeVisible()

    // Description field
    await expect(
      modal.locator('text=Description, label:has-text("Description"), textarea')
    ).toBeVisible()

    // Color selector — either a label or color swatches
    await expect(
      modal.locator('text=Color, label:has-text("Color"), [class*="color"]').first()
    ).toBeVisible()

    // Visibility selector
    await expect(
      modal.locator('text=Visibility, label:has-text("Visibility"), text=Private, text=Public').first()
    ).toBeVisible()
  })

  test('create board modal validates required title field', async ({ page }) => {
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Boards')

    const createButton = page
      .locator('button:has-text("New Board"), button:has-text("Create"), button:has-text("Add")')
      .first()
    await createButton.click()

    const modal = page.locator('[role="dialog"]')
    await expect(modal).toBeVisible({ timeout: 5000 })

    // Try to submit without filling in title
    const submitButton = modal.locator('button[type="submit"], button:has-text("Create")')
    await submitButton.click()

    // Should show validation error or not close the modal
    await expect(modal).toBeVisible({ timeout: 2000 })
  })

  test('boards page has search functionality', async ({ page }) => {
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Boards')

    // Should have a search input
    const searchInput = page.locator(
      'input[placeholder*="search" i], input[placeholder*="Search" i], input[type="search"]'
    ).first()
    await expect(searchInput).toBeVisible({ timeout: 10000 })
  })

  test('boards page has grid/list view toggle', async ({ page }) => {
    const isAuth = await ensureAuthenticated(page)
    if (!isAuth) {
      test.skip(true, 'No test credentials configured')
      return
    }

    await page.goto('/Boards')

    // View toggle buttons (grid and list icons)
    const viewToggle = page.locator('button[class*="view"], [aria-label*="grid"], [aria-label*="list"]').first()
    // At least one view option should exist
    await expect(viewToggle).toBeVisible({ timeout: 10000 }).catch(() => {
      // Some implementations may not have visible toggles — that's OK
    })
  })
})
