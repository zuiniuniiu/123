const { test, expect } = require('@playwright/test');

test.describe('Smoke Tests', () => {

  test('dotnet build should succeed', async () => {
    const { execSync } = require('child_process');
    const result = execSync('dotnet build src\\LibrarySeatReservation.Web\\LibrarySeatReservation.Web.csproj', {
      cwd: process.cwd().replace(/\\tests\\e2e.*/, ''),
      encoding: 'utf8',
    });
    expect(result).toContain('已成功生成');
    expect(result).not.toContain('错误');
  });

  test('P01 Home page returns 200', async ({ page }) => {
    const resp = await page.goto('/');
    expect(resp?.status()).toBe(200);
    await expect(page.locator('h3')).toContainText('座位预约');
  });

  test('P02 Seat list returns 200', async ({ page }) => {
    const resp = await page.goto('/Seat/Index');
    expect(resp?.status()).toBe(200);
    await expect(page.locator('h4')).toContainText('座位列表');
  });

  test('P06 Admin login returns 200', async ({ page }) => {
    const resp = await page.goto('/Admin/Login');
    expect(resp?.status()).toBe(200);
    await expect(page.locator('h4')).toContainText('管理员登录');
  });

  test('P09 Statistics returns 200 with auth', async ({ page }) => {
    await page.goto('/Admin/Login');
    await page.fill('input[asp-for="Username"]', 'admin');
    await page.fill('input[asp-for="Password"]', 'admin123');
    await page.click('button:has-text("登录")');
    await page.waitForURL('**/Admin/Reservation');
    const resp = await page.goto('/Admin/Statistics');
    expect(resp?.status()).toBe(200);
    await expect(page.locator('h5')).toContainText('数据统计');
  });
});
