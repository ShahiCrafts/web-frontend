import { test as base } from '@playwright/test';

const ADMIN_EMAIL = 'dev.shahi.apps@gmail.com'; // use your admin email here
const ADMIN_PASSWORD = 'SaugatShahi$1'; // use your admin password here

// Extend Playwright test with an `adminAuth` fixture
export const test = base.extend({
  adminAuth: async ({ page }, use) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill in email and password fields
    await page.fill('input[name="email"]', ADMIN_EMAIL);
    await page.fill('input[name="password"]', ADMIN_PASSWORD);

    // Click the login button and wait for navigation
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]'),
    ]);

    // Verify login success by checking for an element visible only to admin
    await page.waitForSelector('text=Performance Summary');

    // Pass the authenticated page to the test
    await use(page);
  },
});