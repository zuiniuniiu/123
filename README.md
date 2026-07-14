# LibrarySeatReservation - 图书馆座位预约系统

## 项目简介

基于 ASP.NET Core MVC 的轻量图书馆座位预约系统。学生可在线浏览空闲座位、预约、管理预约；管理员可维护座位信息、查看预约情况和统计数据。

---

## 技术栈

| 层面 | 选型 |
|------|------|
| 后端框架 | ASP.NET Core MVC (.NET 10) |
| 视图引擎 | Razor (.cshtml) |
| 数据库 | SQL Server LocalDB |
| ORM | EF Core 10 + SQL Server Provider |
| 前端 | Bootstrap 5.3 (CDN) |
| 认证 | Session（体验账号切换 + 管理端登录） |

---

## 目录结构

```
LibrarySeatReservation.sln
├── src/
│   └── LibrarySeatReservation.Web/
│       ├── Controllers/         # 4 个 Controller
│       ├── Models/
│       │   ├── Entities/        # 4 Entity + 2 枚举
│       │   └── ViewModels/      # 7 个 ViewModel
│       ├── Services/            # 4 组接口+实现
│       ├── Data/                # DbContext + DbInitializer
│       ├── Migrations/          # EF Core 迁移
│       ├── Views/               # 9 页面 + Layout
│       ├── wwwroot/             # 静态资源
│       ├── Program.cs           # 启动配置
│       └── appsettings.json     # 连接字符串
├── docs/                        # 项目文档（16 份）
├── tests/                       # Playwright 自动测试（19 用例）
├── scripts/                     # 烟雾测试脚本
└── prototype/                   # 静态原型
```

---

## 运行前提

- Windows 10 / 11
- .NET 8+ SDK（当前环境：.NET 10.0.201）
- SQL Server LocalDB（随 Visual Studio 安装或单独安装）
- Git

---

## 运行步骤

```bash
# 1. 还原依赖
dotnet restore src\LibrarySeatReservation.Web\LibrarySeatReservation.Web.csproj

# 2. 启动（首次运行自动建库 + 种子数据）
dotnet run --project src\LibrarySeatReservation.Web
```

启动后访问 `http://localhost:5000` 即可进入首页。

---

## 当前阶段

📌 **Sprint 4 ✅ 完成 — 联调、测试与缺陷闭环，`dotnet build` 通过，Playwright + msedge E2E 覆盖。**

当前仓库包含：
- ✅ 全部需求与设计文档（docs/01 ~ docs/16）
- ✅ 9 页静态 HTML 原型（prototype/static-v1/）
- ✅ 审计与复核报告（docs/11 ~ docs/16）
- ✅ ASP.NET Core MVC 项目代码（src/LibrarySeatReservation.Web/）
- ✅ 4 个 Entity + 2 个枚举
- ✅ AppDbContext + DbInitializer（Seed Data）
- ✅ 4 组 Service（接口 + 实现）
- ✅ 4 个 Controller + 9 个 View
- ✅ SQL Server LocalDB 自动建库（Code First Migration）
- ✅ `dotnet build` 通过（0 错误 0 警告）
- ✅ **Sprint 1 ✅ 用户端完整闭环**：首页→座位列表（区域+楼层筛选）→详情（时段可用性）→预约提交→我的预约→取消
- ✅ P01 首页 — 推荐空闲座位 + 账号切换（下拉显示当前用户）
- ✅ P02 座位列表 — 区域 + 楼层双筛选 + 重置 + 状态徽标
- ✅ P03 座位详情 — 座位信息卡 + 日期切换 + 时段空闲/已满提示
- ✅ P04 预约提交 — 预填参数 + 冲突检测 + 事务写入
- ✅ P05 我的预约 — 列表（含已完成/已取消） + 取消确认
- ✅ **Sprint 2 ✅ 管理端完整闭环**：登录→预约管理（状态筛选+标记完成）→座位管理（CRUD+状态切换）→统计（DB 实时数据）
- ✅ `[AdminOnly]` 权限过滤器（`AdminOnlyAttribute`），未登录自动跳转 /Admin/Login
- ✅ `_AdminLayout` 共享布局（深色导航 + container-fluid + 退出按钮）
- ✅ **Sprint 3 ✅ 功能完善与体验优化**：CSRF 防护全覆盖、状态徽标统一、导航下拉完整、ModelState 验证、原型修复
- ✅ **Sprint 4 ✅ 联调测试与缺陷闭环**：Playwright + msedge 测试框架、用户端/管理端 E2E、烟雾测试、兼容性测试、8 个 Bug 闭环

---

## 数据库初始化方式

启动时自动执行 EF Core 迁移（`DbContext.Migrate()`）+ 填充 Seed Data（`DbInitializer.Seed()`），无需手动执行 SQL。

如需手动重建数据库：
```bash
dotnet ef database drop --project src\LibrarySeatReservation.Web
dotnet ef database update --project src\LibrarySeatReservation.Web
```

---

## 建议演示路径

```
1. 启动：dotnet run --project src\LibrarySeatReservation.Web
2. 访问 http://localhost:5000 → 首页 + 推荐空闲座位
3. 导航栏切换账号（张三/李四/王五），下拉框显示当前用户
4. 点击"查看全部座位" → P02 座位列表，测试区域+楼层筛选 + 重置
5. 点击任意空闲座位 → P03 详情，查看时段空闲/已满状态
6. 选择日期 + 空闲时段 → "提交预约" → P04 确认 → 跳转 P05 我的预约
7. 在 P05 查看新预约，点击"取消"并确认 → 状态变为"已取消"

**管理端演示路径：**
```
1. 访问 /Admin/Login → 管理员登录
2. 输入 admin / admin123 → 进入 P07 预约管理
3. 按状态筛选预约，点击"标记完成"
4. 导航到 P08 座位管理 → 新增/编辑/删除座位 + 切换状态
5. 导航到 P09 统计页 → 查看汇总数据和时段分布
6. 切换到用户端，确认管理端操作已回流（标记完成/座位状态变更可见）
7. 点击"退出" → 退出登录
```

---

## 演示账号

| 角色 | 账号 | 密码 | 说明 |
|------|------|------|------|
| 体验用户 | 张三 / 李四 / 王五 | 无密码 | 导航栏下拉切换 |
| 管理员 | admin | admin123 | 访问 `/Admin/Login` |

---

## 已实现范围

- [x] **Sprint 0** — 项目骨架、Entity、DbContext、Seed Data、Service 骨架、Controller 骨架、dotnet build
- [x] **Sprint 1** — 用户端 5 页面完整开发（首页、座位列表、座位详情、预约提交、我的预约 + 取消）
- [x] **Sprint 2** — 管理端 4 页面（登录、预约管理、座位管理、统计页）+ 权限控制 + 布局统一 + 状态回流
- [x] **Sprint 3** — 功能完善与体验优化（CSRF 防护全覆盖、P04/P06 ModelState 验证、空状态链接、radio 预选、状态筛选记忆、card hover、手机适配、Program.cs Migration 对齐）
- [x] **Sprint 4** — 联调、测试与缺陷闭环（Playwright + msedge E2E 19 用例全部通过、脚本烟雾测试 7/7、兼容性测试、Bug 闭环）

---

## 已知限制

- 密码明文存储（课堂项目，建议后续使用 ASP.NET Core Identity）
- 无操作日志审计
- 无分页（演示数据量小）
- 不做移动端完整适配（管理端仅桌面）
- 管理员仅一个固定账号
- 早高峰时段并发预约无锁保护（课堂数据量级无需悲观锁）

---

## 自动化测试

### Playwright 自动点击烟雾测试（19 用例）

```bash
# 安装 Playwright（首次）
npm i -D @playwright/test

# 启动应用
dotnet run --project src\LibrarySeatReservation.Web\LibrarySeatReservation.Web.csproj --urls http://localhost:5000

# 运行测试
npx playwright test tests/smoke.spec.ts --reporter=list
```

- 浏览器：`channel: 'msedge'` — 使用系统 Microsoft Edge Stable
- 覆盖：用户端闭环、管理端闭环、跨端回流、权限控制
- 结果：19/19 全部通过（见 docs/16）

### 脚本烟雾测试

```bash
# 需要应用已在 http://localhost:5000 运行
node scripts/smoke.mjs
```

- 检查 7 个关键端点：首页、P02~P09
- 结果：7/7 全部通过

---

## 仓库

- 远端地址：`https://github.com/zuiniuniiu/123`
