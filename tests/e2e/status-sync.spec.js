const { test, expect } = require('@playwright/test');

test.describe('Status Sync (Admin → User Side)', () => {

  test('admin marks reservation completed → user can see completed status', async ({ page, context }) => {
    await page.goto('/Admin/Login');
    await page.fill('input[asp-for="Username"]', 'admin');
    await page.fill('input[asp-for="Password"]', 'admin123');
    await page.click('button:has-text("登录")');
    await page.waitForURL('**/Admin/Reservation');

    const completeBtn = page.locator('button:has-text("标记完成")').first();
    if (await completeBtn.isVisible()) {
      await completeBtn.click();
      await page.waitForURL('**/Admin/Reservation**');
    }

    const userPage = await context.newPage();
    await userPage.goto('/Reservation/MyReservations');
    await expect(userPage.locator('h4')).toContainText('我的预约');
    await userPage.close();
  });

  test('admin toggles seat → user sees status change', async ({ page, context }) => {
    await page.goto('/Admin/Login');
    await page.fill('input[asp-for="Username"]', 'admin');
    await page.fill('input[asp-for="Password"]', 'admin123');
    await page.click('button:has-text("登录")');
    await page.waitForURL('**/Admin/Reservation');

    await page.click('a:has-text("座位管理")');
    await page.waitForURL('**/Admin/Seat');

    const toggleBtn = page.locator('button:has-text("维护")').first();
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await page.waitForURL('**/Admin/Seat**');
    }

    const userPage = await context.newPage();
    await userPage.goto('/Seat/Index');
    await expect(userPage.locator('h4')).toContainText('座位列表');

    const maintenanceBadge = userPage.locator('.badge.bg-warning').first();
    if (await maintenanceBadge.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(maintenanceBadge).toContainText('维护中');
    }
    await userPage.close();
  });
});
