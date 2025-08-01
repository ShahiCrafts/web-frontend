import { test, expect } from "@playwright/test";

const testEmail = "crafts.shahi@gmail.com";
const testPassword = "SaugatShahi$1";

test("User creates a report issue post and adds a comment", async ({ page }) => {
  // Step 1: Login
  await page.goto("/login");
  await page.fill('input[name="email"]', testEmail);
  await page.fill('input[name="password"]', testPassword);
  await page.click('button[type="submit"]');

  await expect(page.getByRole("status")).toContainText("Login successful");
  await page.waitForURL("/citizen/home");

  // Step 2: Navigate to Create Post
  await page.getByRole("button", { name: "Create Post" }).click();
  await expect(
    page.getByRole("heading", { name: "Create New Post" })
  ).toBeVisible();

  // Step 3: Select "Report Issue"
  await page.getByRole("button", { name: /Report Issue/i }).click();

  // Step 4: Fill "Report Details" with a unique title
  const issueTitle = `Broken Streetlight Near Main Road - ${Date.now()}`;
  const issueDescription =
    "The streetlight on the corner of Main and 2nd has been out for over a week. It makes the area unsafe at night.";

  await page.getByLabel("Visibility").selectOption("Public");
  await page.getByLabel("Issue Title").fill(issueTitle);
  await page.getByLabel("Detailed Description").fill(issueDescription);

  // Step 5: Classification - select first category
  await page.getByLabel("Category").selectOption({ index: 1 });

  // Step 6: Upload an image (optional)
  const [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.getByRole("button", { name: /Upload Photos/i }).click(),
  ]);
  await fileChooser.setFiles("tests/testImage.png");

  // Step 7: Contact Info and preferences
  await page
    .getByLabel("Contact Information (Optional)")
    .fill("user@example.com");
  await page.getByLabel("Expected Resolution Time").selectOption("week");

  // Toggle visibility options
  await page.getByText("Public Visibility").click();
  await page.getByText("Allow Comments").click();

  // Step 8: Publish the post
  await page.getByRole("button", { name: /Publish/i }).click();

  // Step 9: Expect success toast
  const successToast = page.getByText("Post created successfully!");
  await expect(successToast).toBeVisible();
  await successToast.waitFor({ state: "hidden" });

  // Step 10: Navigate back to homepage
  await page.goto("/citizen/home");

  // Step 11: Click the comment button on the new post
  // Find the new post card using its unique title.
  const newPostCard = page
    .locator('article, div', { hasText: issueTitle })
    .first();
  
  // Wait for the post card to be visible.
  await expect(newPostCard).toBeVisible();

  // Find the comment button within that post card by role, and then filter for visibility
  const commentBtn = newPostCard
    .getByRole('button', { name: "0 Comments" })
    .filter({ has: page.locator(':visible') })
    .first();
  
  await expect(commentBtn).toBeVisible();
  await commentBtn.click();

  // Step 12: Enter a comment in the modal
  const commentInput = page.getByPlaceholder("Write a comment...");
  await expect(commentInput).toBeVisible();
  await commentInput.fill("This needs urgent attention!");
  await page.getByRole("button", { name: /Post comment/i }).click();

  // Step 13: Confirm comment appears
  await expect(page.getByText("This needs urgent attention!")).toBeVisible();
});