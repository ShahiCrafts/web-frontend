import { test as authTest } from './auth.fixtures.js';
import { expect } from '@playwright/test';

authTest.describe('Create Notification Template Modal', () => {
  // Test case to ensure an admin can successfully create a new notification template
  authTest('should allow admin to create a new notification template', async ({ adminAuth: page }) => {
    // Navigate to the notifications page
    await page.goto('/admin/notifications');

    // Click the "Templates" button to navigate to the templates list
    await page.getByRole('button', { name: 'Templates' }).click();

    // Click the button to open the Create Template modal (this is the first one found)
    await page.getByRole('button', { name: 'Create Template' }).first().click();

    // Assert that the modal is visible
    await expect(page.locator('text=Create New Notification Template')).toBeVisible();

    // Fill in the template details
    await page.fill('input#template-title', 'Test Template Title #123');
    await page.selectOption('select#template-category', 'Events'); // Select 'Events' category
    await page.fill('input#template-subject', 'Event Reminder: {{eventName}}');
    await page.fill('textarea#template-content', 'Hi, this is a reminder for {{eventName}} on {{eventDate}} at {{eventTime}}.');
    await page.fill('input#template-variables', 'eventName, eventDate, eventTime');

    // Click the "Create Template" button within the modal (this is the second one found)
    const createTemplateSubmitBtn = page.getByRole('button', { name: 'Create Template', exact: true }).nth(1);
    await expect(createTemplateSubmitBtn).toBeEnabled(); // Ensure the button is enabled
    await createTemplateSubmitBtn.click();

    // Assert that a success toast message appears
    await expect(page.locator('text=Template created successfully!').first()).toBeVisible({ timeout: 10000 });

    // Assert that the modal closes after successful creation
    await expect(page.locator('text=Create New Notification Template')).not.toBeVisible();

    // Optional: Verify the new template appears in the list (if applicable)
    // This depends on your UI, e.g., await expect(page.locator('text=Test Template Title')).toBeVisible();
  });

  // Test case to ensure validation works when required fields are missing
  authTest('should show error if required fields are missing when creating a template', async ({ adminAuth: page }) => {
    // Navigate to the notifications page
    await page.goto('/admin/notifications');

    // Click the "Templates" button to navigate to the templates list
    await page.getByRole('button', { name: 'Templates' }).click();

    // Click the button to open the Create Template modal
    await page.getByRole('button', { name: 'Create Template' }).first().click();
    await expect(page.locator('text=Create New Notification Template')).toBeVisible();

    // Do NOT fill any required fields (title, subject, content)

    // Click the "Create Template" button within the modal
    const createTemplateSubmitBtn = page.getByRole('button', { name: 'Create Template', exact: true }).nth(1);
    await createTemplateSubmitBtn.click();

    // Assert that an error toast message appears for missing fields
    await expect(page.locator('text=Title, Subject, and Content are required.').first()).toBeVisible({ timeout: 5000 });

    // Assert that the modal remains open because of validation error
    await expect(page.locator('text=Create New Notification Template')).toBeVisible();
  });

  // Test case to ensure the modal can be cancelled
  authTest('should allow cancelling the template creation modal', async ({ adminAuth: page }) => {
    // Navigate to the notifications page
    await page.goto('/admin/notifications');

    // Click the "Templates" button to navigate to the templates list
    await page.getByRole('button', { name: 'Templates' }).click();

    // Click the button to open the Create Template modal
    await page.getByRole('button', { name: 'Create Template' }).first().click();
    await expect(page.locator('text=Create New Notification Template')).toBeVisible();

    // Click the "Cancel" button
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();

    // Assert that the modal is no longer visible
    await expect(page.locator('text=Create New Notification Template')).not.toBeVisible();
  });
});
