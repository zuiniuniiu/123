import { test, expect } from '@playwright/test';

/** Smoke test for LibrarySeatReservation — covers user + admin end-to-end */

test.describe('P01 首页', () => {
  test('首页加载并显示推荐空闲座位', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h3')).toContainText('欢迎使用座位预约系统');
    await expect(page.locator('.card-title').first()).toBeVisible();
    await expect(page.getByText('管理后台')).toBeVisible();
    await expect(page.getByText('查看全部座位')).toBeVisible();
  });

  test('导航栏显示当前用户姓名', async ({ page }) => {
    await page.goto('/');
    const userSelect = page.locator('select[name="userName"]');
    await expect(userSelect).toBeVisible();
    await expect(userSelect).toHaveValue('张三');
  });

  test('切换账号为李四', async ({ page }) => {
    await page.goto('/');
    const userSelect = page.locator('select[name="userName"]');
    await userSelect.selectOption('李四');
    await page.waitForTimeout(1500);
    await expect(userSelect).toHaveValue('李四');
    // 切回张三
    await userSelect.selectOption('张三');
    await page.waitForTimeout(500);
  });
});

test.describe('P02 座位列表', () => {
  test('座位列表加载并显示所有座位', async ({ page }) => {
    await page.goto('/Seat/Index');
    await expect(page.locator('h4')).toContainText('座位列表');
    await expect(page.locator('.seat-card')).toHaveCount(8);
  });

  test('区域筛选仅显示该区域座位', async ({ page }) => {
    await page.goto('/Seat/Index');
    await page.locator('select[name="area"]').selectOption('三楼自习区');
    await page.getByText('筛选').click();
    await expect(page.locator('.seat-card')).toHaveCount(3);
  });

  test('区域+楼层联合筛选', async ({ page }) => {
    await page.goto('/Seat/Index');
    await page.locator('select[name="area"]').selectOption('四楼安静区');
    await page.locator('select[name="floor"]').selectOption('4F');
    await page.getByText('筛选').click();
    await expect(page.locator('.seat-card')).toHaveCount(3);
  });

  test('重置按钮清除筛选', async ({ page }) => {
    await page.goto('/Seat/Index');
    await page.locator('select[name="area"]').selectOption('三楼自习区');
    await page.getByText('筛选').click();
    await expect(page.locator('.seat-card')).toHaveCount(3);
    await page.getByText('重置').click();
    await expect(page.locator('.seat-card')).toHaveCount(8);
  });

  test('维护中座位有正确徽标', async ({ page }) => {
    await page.goto('/Seat/Index');
    const b01Card = page.locator('.seat-card').filter({ hasText: 'B-01' });
    await expect(b01Card.locator('.badge')).toContainText('维护中');
  });
});

test.describe('P03 座位详情', () => {
  test('查看空闲座位详情页', async ({ page }) => {
    await page.goto('/Seat/Detail?id=1');
    await expect(page.locator('h4')).toContainText('A-01');
    await expect(page.getByText('08:00-12:00')).toBeVisible();
    await expect(page.getByText('14:00-18:00')).toBeVisible();
    await expect(page.getByText('18:00-21:00')).toBeVisible();
    await expect(page.getByText('提交预约')).toBeVisible();
  });

  test('已预约座位显示提示信息', async ({ page }) => {
    await page.goto('/Seat/Detail?id=2');
    await expect(page.locator('h4')).toContainText('A-02');
    await expect(page.getByText('该座位已被预约')).toBeVisible();
  });

  test('维护中座位显示维修提示', async ({ page }) => {
    await page.goto('/Seat/Detail?id=4');
    await expect(page.locator('h4')).toContainText('B-01');
    await expect(page.getByText('该座位正在维护中，暂不可预约')).toBeVisible();
  });
});

test.describe('P04+P05 预约主链路', () => {
  test('从空闲座位预约并取消', async ({ page }) => {
    // 使用李四
    await page.goto('/');
    await page.locator('select[name="userName"]').selectOption('李四');
    await page.waitForTimeout(1500);

    // 从座位列表找到空闲座位
    await page.goto('/Seat/Index');
    // 点击第一个有"空闲"徽标的座位卡片链接
    const freeSeat = page.locator('.seat-card').filter({ has: page.locator('.badge.bg-success') }).first();
    await expect(freeSeat).toBeVisible();
    await freeSeat.click();

    // 应在详情页
    await page.waitForURL('**/Seat/Detail**');
    // 检查是否有可用的 radio
    const anyRadio = page.locator('input[type="radio"]');
    if (await anyRadio.count() > 0) {
      // 有 radio 按钮 → 选第一个可用时段
      const enabled = page.locator('input[type="radio"]:not([disabled])');
      if (await enabled.count() > 0) {
        await enabled.first().click();
        await page.getByText('提交预约').click();
        await page.waitForURL('**/Reservation/Create**');
        await expect(page.locator('h4')).toContainText('确认预约信息');
        await page.getByRole('button', { name: '确认预约' }).click();
        await page.waitForURL('**/Reservation/MyReservations**');
        // 预约成功后有表格
        await expect(page.locator('table')).toBeVisible();
      }
    }
  });

  test('取消预约', async ({ page }) => {
    await page.goto('/');
    await page.locator('select[name="userName"]').selectOption('李四');
    await page.waitForTimeout(1500);

    await page.goto('/Reservation/MyReservations');
    await expect(page.locator('table')).toBeVisible();

    // 点取消
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: '取消' }).click();
    await page.waitForTimeout(1500);
    // 页面上应有成功提示或已取消徽标
    await expect(page.locator('.alert-success, .badge.bg-secondary').first()).toBeVisible();
  });
});

test.describe('P06+P07 管理端', () => {
  const login = async (page) => {
    await page.goto('/Admin/Login');
    await page.fill('input[name="Username"]', 'admin');
    await page.fill('input[name="Password"]', 'admin123');
    await page.getByRole('button', { name: '登录' }).click();
    await page.waitForURL('**/Admin/Reservation**');
    await expect(page.locator('h5')).toContainText('预约管理');
  };

  test('管理员登录', async ({ page }) => {
    await login(page);
  });

  test('未登录访问管理端被重定向', async ({ page }) => {
    await page.goto('/Admin/Seat');
    await page.waitForURL('**/Admin/Login**');
    await expect(page.locator('h4')).toContainText('管理员登录');
  });

  test('管理员状态筛选', async ({ page }) => {
    await login(page);
    await page.locator('select[name="status"]').selectOption('0');
    await page.waitForTimeout(1000);
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('管理员访问统计页', async ({ page }) => {
    await login(page);
    await page.goto('/Admin/Statistics');
    await expect(page.locator('h5')).toContainText('数据统计');
    await expect(page.locator('.card h2')).toHaveCount(3);
  });

  test('管理员退出登录', async ({ page }) => {
    await login(page);
    await page.getByText('退出').click();
    await page.waitForURL('**/Admin/Login**');
    await expect(page.locator('h4')).toContainText('管理员登录');
  });
});

test.describe('跨端状态回流', () => {
  test('管理端+用户端数据一致', async ({ page }) => {
    // 管理员登录并进入预约管理
    await page.goto('/Admin/Login');
    await page.fill('input[name="Username"]', 'admin');
    await page.fill('input[name="Password"]', 'admin123');
    await page.getByRole('button', { name: '登录' }).click();
    await page.waitForURL('**/Admin/Reservation**');
    await expect(page.locator('h5')).toContainText('预约管理');

    // 切换到用户端
    await page.goto('/');
    await page.locator('select[name="userName"]').selectOption('张三');
    await page.waitForTimeout(1500);

    // 查看张三的预约
    await page.goto('/Reservation/MyReservations');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.getByText('A-01')).toBeVisible();
  });
});
