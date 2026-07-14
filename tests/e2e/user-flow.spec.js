const { test, expect } = require('@playwright/test');

test.describe('User Main Flow (P01 → P02 → P03 → P04 → P05)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('P01 Home - shows recommended seats and user switch', async ({ page }) => {
    await expect(page.locator('h3')).toContainText('座位预约');
    await expect(page.locator('.card')).not.toHaveCount(0);
    const userSelect = page.locator('select[name="userName"]');
    await expect(userSelect).toBeVisible();
    await expect(page.locator('text=查看全部座位')).toBeVisible();
  });

  test('P01 → P02 - navigate to seat list', async ({ page }) => {
    await page.click('text=查看全部座位');
    await page.waitForURL('**/Seat/Index**');
    await expect(page.locator('h4')).toContainText('座位列表');
    await expect(page.locator('select[name="area"]')).toBeVisible();
    await expect(page.locator('select[name="floor"]')).toBeVisible();
  });

  test('P02 - filter by area and reset', async ({ page }) => {
    await page.goto('/Seat/Index');
    const initialCount = await page.locator('.card').count();

    await page.selectOption('select[name="area"]', '三楼自习区');
    await page.click('button:has-text("筛选")');
    await page.waitForURL('**/Seat/Index?area=*');
    const filteredCount = await page.locator('.card').count();
    expect(filteredCount).toBeLessThanOrEqual(initialCount);

    await page.click('a:has-text("重置")');
    await page.waitForURL('**/Seat/Index');
  });

  test('P03 - seat detail page shows time slots', async ({ page }) => {
    await page.goto('/Seat/Index');
    const firstSeat = page.locator('.card').first();
    await firstSeat.click();
    await page.waitForURL('**/Seat/Detail/**');

    await expect(page.locator('text=返回座位列表')).toBeVisible();
    await expect(page.locator('text=预约操作').or(page.locator('text=暂不可预约'))).toBeVisible();
  });

  test('P03 → P04 - create reservation from detail', async ({ page }) => {
    await page.goto('/Seat/Index');
    const availableSeat = page.locator('.card').first();
    await availableSeat.click();
    await page.waitForURL('**/Seat/Detail/**');

    const reserveBtn = page.locator('button:has-text("提交预约")');
    if (await reserveBtn.isVisible()) {
      const radio = page.locator('input[type="radio"][name="TimeSlot"]:not([disabled])').first();
      if (await radio.isVisible()) {
        await radio.check();
        await reserveBtn.click();
        await page.waitForURL('**/Reservation/Create**');
        await expect(page.locator('h4')).toContainText('确认预约信息');
      }
    }
  });

  test('P05 - my reservations page accessible', async ({ page }) => {
    await page.goto('/Reservation/MyReservations');
    await expect(page.locator('h4')).toContainText('我的预约');
  });
});
