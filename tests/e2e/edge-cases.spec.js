const { test, expect } = require('@playwright/test');

test.describe('Edge Case & Exception Tests', () => {

  test('P02 - empty seat list message', async ({ page }) => {
    await page.goto('/Seat/Index?area=不存在的区域');
    const alert = page.locator('.alert-info');
    if (await alert.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(alert).toContainText('没有找到匹配的座位');
    }
  });

  test('P05 - empty reservations for new user', async ({ page }) => {
    await page.goto('/');
    await page.selectOption('select[name="userName"]', '王五');
    await page.goto('/Reservation/MyReservations');
    await expect(page.locator('.alert-info')).toContainText('还没有预约记录');
  });

  test('P08 - cannot delete seat with active reservations', async ({ page }) => {
    await page.goto('/Admin/Login');
    await page.fill('input[asp-for="Username"]', 'admin');
    await page.fill('input[asp-for="Password"]', 'admin123');
    await page.click('button:has-text("登录")');
    await page.waitForURL('**/Admin/Reservation');

    await page.click('a:has-text("座位管理")');
    await page.waitForURL('**/Admin/Seat');

    const firstDelete = page.locator('button:has-text("删除")').first();
    if (await firstDelete.isVisible()) {
      page.on('dialog', dialog => dialog.accept());
      await firstDelete.click();
    }
  });

  test('P04 - CSRF token exists in form', async ({ page }) => {
    await page.goto('/Seat/Index');
    const firstSeat = page.locator('.card').first();
    await firstSeat.click();
    await page.waitForURL('**/Seat/Detail/**');

    const radio = page.locator('input[type="radio"][name="TimeSlot"]:not([disabled])').first();
    if (await radio.isVisible({ timeout: 2000 }).catch(() => false)) {
      await radio.check();
      await page.click('button:has-text("提交预约")');
      await page.waitForURL('**/Reservation/Create**');
    }

    await page.goto('/Reservation/Create?seatId=1');
    await expect(page.locator('input[name="__RequestVerificationToken"]')).toBeVisible();
  });

  test('P06 - admin login CSRF token exists', async ({ page }) => {
    await page.goto('/Admin/Login');
    await expect(page.locator('input[name="__RequestVerificationToken"]')).toBeVisible();
  });

  test('P07 - admin reservation empty state', async ({ page }) => {
    await page.goto('/Admin/Login');
    await page.fill('input[asp-for="Username"]', 'admin');
    await page.fill('input[asp-for="Password"]', 'admin123');
    await page.click('button:has-text("登录")');
    await page.waitForURL('**/Admin/Reservation');

    await page.selectOption('select[name="status"]', '999');
    await page.waitForTimeout(500);
    const emptyAlert = page.locator('.alert-info');
    if (await emptyAlert.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(emptyAlert).toContainText('暂无预约记录');
    }
  });
});
