import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  const testEmail = "crafts.shahi@gmail.com";
  const testPassword = "SaugatShahi$1";

  test("User can log in with correct credentials", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);

    await page.click('button[type="submit"]');

    await expect(page.locator("text=Login successful")).toBeVisible();
    await page.waitForURL("/citizen/home");
  });
  test("Shows error for invalid login", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "invalid@example.com");
    await page.fill('input[name="password"]', "WrongPass");

    await page.click('button[type="submit"]');

    await expect(page.getByRole("status")).toHaveText(
      "User not found! Please sign up.."
    );
  });
});
