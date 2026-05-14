// Shared test utilities for e2e tests

/**
 * Login helper - authenticates a test user
 */
export async function login(page, email = 'test@example.com', password = 'testpassword123') {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/', { timeout: 10000 });
}

/**
 * Wait for loading states to resolve
 */
export async function waitForLoad(page) {
  await page.waitForSelector('.animate-spin', { state: 'hidden', timeout: 10000 }).catch(() => {});
  await page.waitForLoadState('networkidle');
}

/**
 * Navigate to a specific page
 */
export async function navigateTo(page, pageName) {
  await page.goto(`/${pageName}`);
  await waitForLoad(page);
}
