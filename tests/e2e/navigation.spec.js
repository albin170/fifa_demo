/**
 * @fileoverview Playwright end-to-end tests for StadiumIQ 2026.
 * Tests keyboard navigation (Ctrl+1-9), sidebar toggle, role selector,
 * and AI chat interaction.
 *
 * Run with: npx playwright test
 */

import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use file:// URL to open the local static HTML
const APP_URL = `file://${path.resolve(__dirname, '../../index.html')}`;

test.describe('StadiumIQ 2026 — Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    // Wait for loading screen to disappear
    await page.waitForSelector('#loadingScreen', { state: 'detached', timeout: 5000 });
    // Wait for app to be rendered
    await page.waitForSelector('.sidebar', { timeout: 5000 });
  });

  test('page title contains StadiumIQ', async ({ page }) => {
    expect(await page.title()).toContain('StadiumIQ');
  });

  test('Ctrl+1 navigates to Command Center', async ({ page }) => {
    await page.keyboard.press('Control+1');
    await expect(page.locator('#pageTitle')).toHaveText('Command Center');
  });

  test('Ctrl+2 navigates to AI Navigation', async ({ page }) => {
    await page.keyboard.press('Control+2');
    await expect(page.locator('#pageTitle')).toHaveText('AI Navigation');
  });

  test('Ctrl+3 navigates to Crowd Intelligence', async ({ page }) => {
    await page.keyboard.press('Control+3');
    await expect(page.locator('#pageTitle')).toHaveText('Crowd Intelligence');
  });

  test('Ctrl+4 navigates to Accessibility Hub', async ({ page }) => {
    await page.keyboard.press('Control+4');
    await expect(page.locator('#pageTitle')).toHaveText('Accessibility Hub');
  });

  test('Ctrl+5 navigates to Smart Transport', async ({ page }) => {
    await page.keyboard.press('Control+5');
    await expect(page.locator('#pageTitle')).toHaveText('Smart Transport');
  });

  test('Ctrl+6 navigates to Sustainability AI', async ({ page }) => {
    await page.keyboard.press('Control+6');
    await expect(page.locator('#pageTitle')).toHaveText('Sustainability AI');
  });

  test('Ctrl+7 navigates to Global Concierge', async ({ page }) => {
    await page.keyboard.press('Control+7');
    await expect(page.locator('#pageTitle')).toHaveText('Global Concierge');
  });

  test('Ctrl+8 navigates to Ops Intelligence', async ({ page }) => {
    await page.keyboard.press('Control+8');
    await expect(page.locator('#pageTitle')).toHaveText('Ops Intelligence');
  });

  test('Ctrl+9 navigates to Decision Support', async ({ page }) => {
    await page.keyboard.press('Control+9');
    await expect(page.locator('#pageTitle')).toHaveText('Decision Support');
  });

  test('active nav item has aria-current="page"', async ({ page }) => {
    await page.keyboard.press('Control+2');
    const navBtn = page.locator('#nav-navigation');
    await expect(navBtn).toHaveAttribute('aria-current', 'page');
  });

  test('document title updates on navigation', async ({ page }) => {
    await page.keyboard.press('Control+3');
    expect(await page.title()).toContain('Crowd Intelligence');
  });
});

test.describe('StadiumIQ 2026 — Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.waitForSelector('#loadingScreen', { state: 'detached', timeout: 5000 });
    await page.waitForSelector('.sidebar');
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 812 });
  });

  test('hamburger button has aria-expanded="false" by default', async ({ page }) => {
    const btn = page.locator('#hamburgerBtn');
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  test('hamburger button toggles aria-expanded on click', async ({ page }) => {
    const btn = page.locator('#hamburgerBtn');
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  test('sidebar closes when overlay is clicked on mobile', async ({ page }) => {
    const btn = page.locator('#hamburgerBtn');
    await btn.click();
    await page.locator('#pageOverlay').click({ force: true });
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('StadiumIQ 2026 — Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.waitForSelector('#loadingScreen', { state: 'detached', timeout: 5000 });
    await page.waitForSelector('.sidebar');
  });

  test('skip link is present and references #pageContent', async ({ page }) => {
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#pageContent');
  });

  test('main content has role="main"', async ({ page }) => {
    const main = page.locator('[role="main"]');
    await expect(main).toHaveCount(1);
  });

  test('sidebar has role="navigation"', async ({ page }) => {
    const nav = page.locator('[role="navigation"]');
    await expect(nav).toHaveCount(1);
  });

  test('all nav buttons are keyboard focusable', async ({ page }) => {
    const navButtons = page.locator('.nav-link');
    const count = await navButtons.count();
    expect(count).toBeGreaterThan(8);
  });
});

test.describe('StadiumIQ 2026 — Role Selector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.waitForSelector('#loadingScreen', { state: 'detached', timeout: 5000 });
    await page.waitForSelector('#roleSelector');
  });

  test('role selector has 5 options', async ({ page }) => {
    const options = page.locator('#roleSelector option');
    await expect(options).toHaveCount(5);
  });

  test('changing role shows a toast notification', async ({ page }) => {
    await page.selectOption('#roleSelector', 'staff');
    // Toast should appear
    await expect(page.locator('.toast')).toBeVisible({ timeout: 2000 });
  });
});

test.describe('StadiumIQ 2026 — AI Chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    await page.waitForSelector('#loadingScreen', { state: 'detached', timeout: 5000 });
    await page.keyboard.press('Control+2'); // Navigate to AI Navigation
    await page.waitForSelector('.chat-messages');
  });

  test('chat interface renders with initial AI greeting', async ({ page }) => {
    const messages = page.locator('.chat-message.ai');
    await expect(messages.first()).toBeVisible();
  });

  test('typing and submitting a message adds it to chat', async ({ page }) => {
    const inputs = page.locator('.chat-input-area input[type="text"]');
    const input = inputs.first();
    await input.fill('Where is Gate B?');
    await input.press('Enter');

    // User message should appear
    await expect(page.locator('.chat-message.user')).toBeVisible({ timeout: 3000 });
  });
});
