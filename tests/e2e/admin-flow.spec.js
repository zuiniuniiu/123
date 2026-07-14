const { test, expect } = require('@playwright/test');

test.describe('Admin Main Flow (P06 → P07 → P08 → P09)', () => {

  test('P06 - admin login page', async ({ page }) => {
    await page.goto('/Admin/Login');
    await expect(page.locator('h4')).toContainText('管理员登录');
    await expect(page.locator('input[asp-for="Username"]')).toBeVisible();
    await expect(page.locator('input[asp-for="Password"]')).toBeVisible();
  });

  test('P06 - login with valid credentials', async ({ page }) => {
    await page.goto('/Admin/Login');
    await page.fill('input[asp-for="Username"]', 'admin');
    await page.fill('input[asp-for="Password"]', 'admin123');
    await page.click('button:has-text("登录")');
    await page.waitForURL('**/Admin/Reservation');
    await expect(page.locator('h5')).toContainText('预约管理');
  });

  test('P06 - login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/Admin/Login');
    await page.fill('input[asp-for="Username"]', 'admin');
    await page.fill('input[asp-for="Password"]', 'wrong');
    await page.click('button:has-text("登录")');
    await expect(page.locator('.alert-danger')).toContainText('用户名或密码错误');
  });

  test('P07 - reservation management with status filter', async ({ page }) => {
    await page.goto('/Admin/Login');
    await page.fill('input[asp-for="Username"]', 'admin');
    await page.fill('input[asp-for="Password"]', 'admin123');
    await page.click('button:has-text("登录")');
    await page.waitForURL('**/Admin/Reservation');

    await expect(page.locator('h5')).toContainText('预约管理');
    await expect(page.locator('select[name="status"]')).toBeVisible();

    await page.selectOption('select[name="status"]', '0');
    await page.waitForURL('**/Reservation?status=0**');
  });

  test('P08 - seat management CRUD', async ({ page }) => {
    await page.goto('/Admin/Login');
    await page.fill('input[asp-for="Username"]', 'admin');
    await page.fill('input[asp-for="Password"]', 'admin123');
    await page.click('button:has-text("登录")');
    await page.waitForURL('**/Admin/Reservation');

    await page.click('a:has-text("座位管理")');
    await page.waitForURL('**/Admin/Seat');

    await expect(page.locator('h5')).toContainText('座位管理');
    await expect(page.locator('text=+ 新增座位')).toBeVisible();
  });

  test('P09 - statistics page shows data', async ({ page }) => {
    await page.goto('/Admin/Login');
    await page.fill('input[asp-for="Username"]', 'admin');
    await page.fill('input[asp-for="Password"]', 'admin123');
    await page.click('button:has-text("登录")');
    await page.waitForURL('**/Admin/Reservation');

    await page.click('a:has-text("统计")');
    await page.waitForURL('**/Admin/Statistics');

    await expect(page.locator('h5')).toContainText('数据统计');
    await expect(page.locator('.card h2')).toHaveCount(3);
  });

  test('P06 - unauthenticated access redirects to login', async ({ page }) => {
    await page.goto('/Admin/Reservation');
    await page.waitForURL('**/Admin/Login');
    await expect(page.locator('h4')).toContainText('管理员登录');
  });

  test('P06 - logout clears session', async ({ page }) => {
    await page.goto('/Admin/Login');
    await page.fill('input[asp-for="Username"]', 'admin');
    await page.fill('input[asp-for="Password"]', 'admin123');
    await page.click('button:has-text("登录")');
    await page.waitForURL('**/Admin/Reservation');

    await page.click('button:has-text("退出")');
    await page.waitForURL('**/Admin/Login');
    await expect(page.locator('h4')).toContainText('管理员登录');
  });
});
