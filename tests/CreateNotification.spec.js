import { test as authTest } from "./auth.fixtures.js";
import { expect } from "@playwright/test";

authTest.describe("Create Notification Modal", () => {
  authTest(
    "should allow admin to send a notification",
    async ({ adminAuth: page }) => {
      await page.goto("/admin/notifications");

      await page.click('button:has-text("Create Notification")');
      await expect(page.locator("text=Create New Notification")).toBeVisible();

      await page.fill("input#title", "Test Notification Title");
      await page.fill(
        "textarea#message",
        "This is a test notification message."
      );

      await page.click('input[type="checkbox"]'); // select first user checkbox

      await page.click('button:has-text("Send Now")');

      await expect(
        page.locator("text=Notification sent successfully!").first()
      ).toBeVisible();
      await expect(
        page.locator("text=Create New Notification")
      ).not.toBeVisible();
    }
  );

  authTest(
    "should show error if required fields are missing",
    async ({ adminAuth: page }) => {
      await page.goto("/admin/notifications");
      await page.click('button:has-text("Create Notification")');

      await page.click('button:has-text("Send Now")');

      await expect(
        page.locator("text=Title, message, and recipient type are required.")
      ).toBeVisible();
    }
  );

  authTest(
    "should allow scheduling a notification",
    async ({ adminAuth: page }) => {
      await page.goto("/admin/notifications");
      await page.click('button:has-text("Create Notification")');

      await page.fill("input#title", "Scheduled Notification");
      await page.fill("textarea#message", "Scheduled notification message");

      await page.click('input[type="checkbox"]');

      // Set schedule date to 1 minute in the future
      const now = new Date(Date.now() + 60 * 1000);
      const datetimeLocal = now.toISOString().slice(0, 16);
      await page.fill("input#scheduledAt", datetimeLocal);

      // Change the locator to be more specific to avoid the strict mode violation.
      // Use getByRole with the exact name 'Schedule'.
      const scheduleBtn = page.getByRole("button", {
        name: "Schedule",
        exact: true,
      });

      // Ensure the button is enabled before clicking. This is good practice.
      await expect(scheduleBtn).toBeEnabled();

      // Click the schedule button
      await scheduleBtn.click();

      // Wait for the success toast message to appear anywhere on the page
      await expect(
        page.locator("text=Notification scheduled successfully!").first()
      ).toBeVisible({ timeout: 10000 });

      // Now, confirm the modal is no longer visible
      await expect(
        page.locator("text=Create New Notification")
      ).not.toBeVisible();
    }
  );
});
