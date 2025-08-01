import { test, expect } from "@playwright/test";

const testEmail = "crafts.shahi@gmail.com";
const testPassword = "SaugatShahi$1";

test("User creates a discussion post", async ({ page }) => {
  // Step 1: Login
  await page.goto("/login");

  await page.fill('input[name="email"]', testEmail);
  await page.fill('input[name="password"]', testPassword);

  await page.click('button[type="submit"]');

  await expect(page.getByRole("status")).toContainText("Login successful");
  await page.waitForURL("/citizen/home");

  // Step 2: Navigate to Create Post
  await page.getByRole("button", { name: "Create Post" }).click();

  // Step 3: Wait for Create Post screen
  await expect(
    page.getByRole("heading", { name: "Create New Post" })
  ).toBeVisible();

  // Step 4: Ensure "Discussion" is selected (if necessary)
  const discussionBtn = page.getByRole("button", { name: /Discussion/i });
  if (await discussionBtn.isVisible()) {
    await discussionBtn.click();
  }

  // Step 5: Fill form fields
  await page.getByLabel("Title *").fill("Playwright Testing Demo");
  await page
    .locator("textarea")
    .fill("This post was created using Playwright e2e test.");

  // Optional: Select community (adjust logic if modal is used)
  const communitySelector = page.getByRole("button", {
    name: /Select a community or post publicly/i,
  });

  // Check if the selector is visible (optional, good for conditional flows)
  if (await communitySelector.isVisible()) {
    await communitySelector.click();

    // Wait for the dropdown/modal to appear before selecting
    const generalOption = page.getByRole("listitem").filter({
      hasText: "General",
    });

    await expect(generalOption).toBeVisible({ timeout: 3000 });
    await generalOption.click();
  }

  // Publish the post
  await page.getByRole("button", { name: /Publish/i }).click();

  // Wait for and assert success toast
  const toast = page
    .getByRole("status")
    .filter({ hasText: "Post created successfully!" });
  await expect(toast).toBeVisible();

  // Optionally wait for the toast to disappear
  await toast.waitFor({ state: "hidden" });
});
