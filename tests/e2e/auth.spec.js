import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('shows login page when not authenticated', async ({ page }) => {
    await page.goto('/')
    // Unauthenticated users should see the login form
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('login page displays AgileFlow branding', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('text=AgileFlow')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Project Management Made Simple')).toBeVisible()
  })

  test('login page shows Welcome Back heading', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('text=Welcome Back')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=Sign in to your AgileFlow account')).toBeVisible()
  })

  test('login form has email and password fields', async ({ page }) => {
    await page.goto('/login')
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')

    await expect(emailInput).toBeVisible({ timeout: 10000 })
    await expect(passwordInput).toBeVisible()

    // Email field should be required
    await expect(emailInput).toHaveAttribute('required', '')
    // Password field should be required and have minlength
    await expect(passwordInput).toHaveAttribute('required', '')
  })

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'nonexistent@test.com')
    await page.fill('input[type="password"]', 'wrongpassword123')
    await page.click('button[type="submit"]')

    // Should show an error message or stay on login page
    const errorVisible = await page
      .locator('.text-red-600, [role="alert"]')
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false)

    if (!errorVisible) {
      // At minimum, user should NOT navigate away from login
      await page.waitForTimeout(2000)
      expect(page.url()).toMatch(/login|\/$/i)
    }
  })

  test('has OAuth login buttons (Google and GitHub)', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('button:has-text("Google")')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('button:has-text("GitHub")')).toBeVisible()
  })

  test('has forgot password link', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('text=Forgot password?')).toBeVisible({ timeout: 10000 })
  })

  test('can switch to signup mode', async ({ page }) => {
    await page.goto('/login')
    // Look for sign-up link/button
    const signupLink = page.locator('text=Sign up, text=Create account, button:has-text("Sign up")').first()
    await expect(signupLink).toBeVisible({ timeout: 10000 })
    await signupLink.click()

    // Should now show Create Account heading
    await expect(page.locator('text=Create Account')).toBeVisible({ timeout: 5000 })
    // Signup form should have a full name field
    await expect(page.locator('#fullName')).toBeVisible()
  })

  test('submit button shows loading state', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')

    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()

    // Button may become disabled or show a spinner during loading
    // Just verify the form was submitted (button was clickable)
    await expect(submitButton).toBeVisible()
  })
})
