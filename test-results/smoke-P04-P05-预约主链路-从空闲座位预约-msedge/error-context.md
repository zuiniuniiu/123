# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> P04+P05 预约主链路 >> 从空闲座位预约
- Location: tests\smoke.spec.ts:95:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('input[type="radio"]:not([disabled])').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('input[type="radio"]:not([disabled])').first()

```

```yaml
- navigation:
  - link "座位预约":
    - /url: /
  - link "座位":
    - /url: /Seat
  - link "我的预约":
    - /url: /Reservation/MyReservations
  - text: 当前用户：
  - combobox:
    - option "张三"
    - option "李四" [selected]
    - option "王五"
  - link "管理":
    - /url: /Admin/Login
- main:
  - link "← 返回座位列表":
    - /url: /Seat
  - heading "C-02" [level=4]
  - table:
    - rowgroup:
      - row "区域 五楼电子阅览":
        - cell "区域"
        - cell "五楼电子阅览"
      - row "楼层 5F":
        - cell "楼层"
        - cell "5F"
      - row "描述 有电源插座，靠窗":
        - cell "描述"
        - cell "有电源插座，靠窗"
      - row "状态 已预约":
        - cell "状态"
        - cell "已预约"
  - text: 该座位已被预约
- contentinfo: © 2026 - 图书馆座位预约系统 · 课堂项目
```

# Test source

```ts
  7   |     await page.goto('/');
  8   |     await expect(page.locator('h3')).toContainText('欢迎使用座位预约系统');
  9   |     await expect(page.locator('.card-title').first()).toBeVisible();
  10  |     await expect(page.getByText('管理后台')).toBeVisible();
  11  |     await expect(page.getByText('查看全部座位')).toBeVisible();
  12  |   });
  13  | 
  14  |   test('导航栏显示当前用户姓名', async ({ page }) => {
  15  |     await page.goto('/');
  16  |     const userSelect = page.locator('select[name="userName"]');
  17  |     await expect(userSelect).toBeVisible();
  18  |     await expect(userSelect).toHaveValue('张三');
  19  |   });
  20  | 
  21  |   test('切换账号为李四', async ({ page }) => {
  22  |     await page.goto('/');
  23  |     const userSelect = page.locator('select[name="userName"]');
  24  |     await userSelect.selectOption('李四');
  25  |     await page.waitForTimeout(1500);
  26  |     await expect(userSelect).toHaveValue('李四');
  27  |     // 切回张三
  28  |     await userSelect.selectOption('张三');
  29  |     await page.waitForTimeout(500);
  30  |   });
  31  | });
  32  | 
  33  | test.describe('P02 座位列表', () => {
  34  |   test('座位列表加载并显示所有座位', async ({ page }) => {
  35  |     await page.goto('/Seat/Index');
  36  |     await expect(page.locator('h4')).toContainText('座位列表');
  37  |     await expect(page.locator('.seat-card')).toHaveCount(8);
  38  |   });
  39  | 
  40  |   test('区域筛选仅显示该区域座位', async ({ page }) => {
  41  |     await page.goto('/Seat/Index');
  42  |     await page.locator('select[name="area"]').selectOption('三楼自习区');
  43  |     await page.getByText('筛选').click();
  44  |     await expect(page.locator('.seat-card')).toHaveCount(3);
  45  |   });
  46  | 
  47  |   test('区域+楼层联合筛选', async ({ page }) => {
  48  |     await page.goto('/Seat/Index');
  49  |     await page.locator('select[name="area"]').selectOption('四楼安静区');
  50  |     await page.locator('select[name="floor"]').selectOption('4F');
  51  |     await page.getByText('筛选').click();
  52  |     await expect(page.locator('.seat-card')).toHaveCount(3);
  53  |   });
  54  | 
  55  |   test('重置按钮清除筛选', async ({ page }) => {
  56  |     await page.goto('/Seat/Index');
  57  |     await page.locator('select[name="area"]').selectOption('三楼自习区');
  58  |     await page.getByText('筛选').click();
  59  |     await expect(page.locator('.seat-card')).toHaveCount(3);
  60  |     await page.getByText('重置').click();
  61  |     await expect(page.locator('.seat-card')).toHaveCount(8);
  62  |   });
  63  | 
  64  |   test('维护中座位有正确徽标', async ({ page }) => {
  65  |     await page.goto('/Seat/Index');
  66  |     const b01Card = page.locator('.seat-card').filter({ hasText: 'B-01' });
  67  |     await expect(b01Card.locator('.badge')).toContainText('维护中');
  68  |   });
  69  | });
  70  | 
  71  | test.describe('P03 座位详情', () => {
  72  |   test('查看空闲座位详情页', async ({ page }) => {
  73  |     await page.goto('/Seat/Detail?id=1');
  74  |     await expect(page.locator('h4')).toContainText('A-01');
  75  |     await expect(page.getByText('08:00-12:00')).toBeVisible();
  76  |     await expect(page.getByText('14:00-18:00')).toBeVisible();
  77  |     await expect(page.getByText('18:00-21:00')).toBeVisible();
  78  |     await expect(page.getByText('提交预约')).toBeVisible();
  79  |   });
  80  | 
  81  |   test('已预约座位显示提示信息', async ({ page }) => {
  82  |     await page.goto('/Seat/Detail?id=2');
  83  |     await expect(page.locator('h4')).toContainText('A-02');
  84  |     await expect(page.getByText('该座位已被预约')).toBeVisible();
  85  |   });
  86  | 
  87  |   test('维护中座位显示维修提示', async ({ page }) => {
  88  |     await page.goto('/Seat/Detail?id=4');
  89  |     await expect(page.locator('h4')).toContainText('B-01');
  90  |     await expect(page.getByText('该座位正在维护中，暂不可预约')).toBeVisible();
  91  |   });
  92  | });
  93  | 
  94  | test.describe('P04+P05 预约主链路', () => {
  95  |   test('从空闲座位预约', async ({ page }) => {
  96  |     // 使用李四（无今日预约冲突）
  97  |     await page.goto('/');
  98  |     await page.locator('select[name="userName"]').selectOption('李四');
  99  |     await page.waitForTimeout(1500);
  100 | 
  101 |     // 选择 C-02（空闲，id=8）
  102 |     await page.goto('/Seat/Detail?id=8');
  103 |     await expect(page.locator('h4')).toContainText('C-02');
  104 | 
  105 |     // 选择一个空闲时段（第一个不被禁用的 radio）
  106 |     const enabledRadio = page.locator('input[type="radio"]:not([disabled])').first();
> 107 |     await expect(enabledRadio).toBeVisible();
      |                                ^ Error: expect(locator).toBeVisible() failed
  108 |     await enabledRadio.click();
  109 | 
  110 |     // 提交预约
  111 |     await page.getByText('提交预约').click();
  112 |     await page.waitForURL('**/Reservation/Create**');
  113 |     // h4 显示"确认预约信息"
  114 |     await expect(page.locator('h4')).toContainText('确认预约信息');
  115 | 
  116 |     // 点击"确认预约"按钮提交
  117 |     await page.getByRole('button', { name: '确认预约' }).click();
  118 |     // 应跳转到我的预约
  119 |     await page.waitForURL('**/Reservation/MyReservations**');
  120 |     await expect(page.locator('td')).toContainText('C-02');
  121 |   });
  122 | 
  123 |   test('取消预约', async ({ page }) => {
  124 |     // 使用李四（有今天预约）
  125 |     await page.goto('/');
  126 |     await page.locator('select[name="userName"]').selectOption('李四');
  127 |     await page.waitForTimeout(1500);
  128 | 
  129 |     await page.goto('/Reservation/MyReservations');
  130 |     await expect(page.locator('table')).toBeVisible();
  131 | 
  132 |     // 点取消
  133 |     page.once('dialog', dialog => dialog.accept());
  134 |     await page.getByRole('button', { name: '取消' }).click();
  135 |     await page.waitForTimeout(1500);
  136 |     // 页面上应有成功提示或已取消徽标
  137 |     await expect(page.locator('.alert-success, .badge.bg-secondary').first()).toBeVisible();
  138 |   });
  139 | });
  140 | 
  141 | test.describe('P06+P07 管理端', () => {
  142 |   const login = async (page) => {
  143 |     await page.goto('/Admin/Login');
  144 |     await page.fill('input[name="Username"]', 'admin');
  145 |     await page.fill('input[name="Password"]', 'admin123');
  146 |     await page.getByRole('button', { name: '登录' }).click();
  147 |     await page.waitForURL('**/Admin/Reservation**');
  148 |     await expect(page.locator('h5')).toContainText('预约管理');
  149 |   };
  150 | 
  151 |   test('管理员登录', async ({ page }) => {
  152 |     await login(page);
  153 |   });
  154 | 
  155 |   test('未登录访问管理端被重定向', async ({ page }) => {
  156 |     await page.goto('/Admin/Seat');
  157 |     await page.waitForURL('**/Admin/Login**');
  158 |     await expect(page.locator('h4')).toContainText('管理员登录');
  159 |   });
  160 | 
  161 |   test('管理员状态筛选', async ({ page }) => {
  162 |     await login(page);
  163 |     await page.locator('select[name="status"]').selectOption('0');
  164 |     await page.waitForTimeout(1000);
  165 |     await expect(page.locator('table tbody tr').first()).toBeVisible();
  166 |   });
  167 | 
  168 |   test('管理员访问统计页', async ({ page }) => {
  169 |     await login(page);
  170 |     await page.goto('/Admin/Statistics');
  171 |     await expect(page.locator('h5')).toContainText('数据统计');
  172 |     await expect(page.locator('.card h2')).toHaveCount(3);
  173 |   });
  174 | 
  175 |   test('管理员退出登录', async ({ page }) => {
  176 |     await login(page);
  177 |     await page.getByText('退出').click();
  178 |     await page.waitForURL('**/Admin/Login**');
  179 |     await expect(page.locator('h4')).toContainText('管理员登录');
  180 |   });
  181 | });
  182 | 
  183 | test.describe('跨端状态回流', () => {
  184 |   test('管理端+用户端数据一致', async ({ page }) => {
  185 |     // 管理员登录并进入预约管理
  186 |     await page.goto('/Admin/Login');
  187 |     await page.fill('input[name="Username"]', 'admin');
  188 |     await page.fill('input[name="Password"]', 'admin123');
  189 |     await page.getByRole('button', { name: '登录' }).click();
  190 |     await page.waitForURL('**/Admin/Reservation**');
  191 |     await expect(page.locator('h5')).toContainText('预约管理');
  192 | 
  193 |     // 切换到用户端
  194 |     await page.goto('/');
  195 |     await page.locator('select[name="userName"]').selectOption('张三');
  196 |     await page.waitForTimeout(1500);
  197 | 
  198 |     // 查看张三的预约
  199 |     await page.goto('/Reservation/MyReservations');
  200 |     await expect(page.locator('table')).toBeVisible();
  201 |     await expect(page.getByText('A-01')).toBeVisible();
  202 |   });
  203 | });
  204 | 
```