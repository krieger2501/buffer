import { test, expect } from '@playwright/test';

test('home page loads and shows navigation', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/Serene/);
});
