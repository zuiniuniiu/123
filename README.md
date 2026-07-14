# LibrarySeatReservation — 图书馆座位预约系统

基于 ASP.NET Core MVC 的轻量图书馆座位预约系统。学生可在线浏览空闲座位、预约、管理预约；管理员可维护座位信息、查看预约情况和统计数据。

## 技术栈

| 层面 | 选型 |
|------|------|
| 后端框架 | ASP.NET Core MVC (.NET 10) |
| 视图引擎 | Razor (.cshtml) |
| 数据库 | SQL Server LocalDB |
| ORM | EF Core 10 + SQL Server Provider |
| 前端 | Bootstrap 5.3 (CDN) |
| 认证 | Session（体验账号切换 + 管理端登录） |
| 自动化测试 | Playwright 1.61 + Microsoft Edge (channel: msedge) |

## 功能清单

| 模块 | 功能 | 页面 |
|------|------|------|
| **用户端** | 查看推荐空闲座位、切换体验账号 | P01 首页 |
| | 浏览全部座位、区域+楼层双筛选、重置 | P02 座位列表 |
| | 查看座位详情、时段可用性、日期切换 | P03 座位详情 |
| | 提交预约（含冲突检测、事务写入） | P04 预约提交 |
| | 查看我的预约列表、取消预约 | P05 我的预约 |
| **管理端** | 管理员登录 / 退出 | P06 管理员登录 |
| | 全部预约列表、状态筛选、标记完成 | P07 预约管理 |
| | 座位 CRUD、状态切换（维护↔恢复） | P08 座位管理 |
| | 统计看板（座位总数/今日预约/本月预约+时段分布） | P09 统计页 |
| **跨端** | 管理端操作 → 用户端实时回流 | — |

## 页面清单

| 编号 | 页面 | 路由 | 角色 |
|------|------|------|------|
| P01 | 首页 | `/` | 所有人 |
| P02 | 座位列表 | `/Seat/Index` | 所有人 |
| P03 | 座位详情 | `/Seat/Detail?id={id}` | 所有人 |
| P04 | 预约提交 | `/Reservation/Create` | 所有人（需选座） |
| P05 | 我的预约 | `/Reservation/MyReservations` | 所有人 |
| P06 | 管理员登录 | `/Admin/Login` | 管理员 |
| P07 | 预约管理 | `/Admin/Reservation` | 管理员 |
| P08 | 座位管理 | `/Admin/Seat` | 管理员 |
| P09 | 统计页 | `/Admin/Statistics` | 管理员 |

## 运行步骤

### 前提条件

- Windows 10 / 11
- .NET 8+ SDK（当前环境：.NET 10.0.201）
- SQL Server LocalDB（随 Visual Studio 安装或单独安装）
- Git

### 启动

```bash
# 1. 还原依赖
dotnet restore src\LibrarySeatReservation.Web\LibrarySeatReservation.Web.csproj

# 2. 启动（首次运行自动建库 + 种子数据）
dotnet run --project src\LibrarySeatReservation.Web
```

启动后访问 `http://localhost:5000` 即可进入首页。

> 数据库自动初始化详见 [`database/README.md`](database/README.md)。

## 数据库初始化方式

- **方式**：EF Core Code First 迁移
- **自动执行**：启动时 `db.Database.Migrate()` 自动建库建表
- **种子数据**：`DbInitializer.Seed()` 自动填充
- **手动重建**：`dotnet ef database drop --project src\LibrarySeatReservation.Web` 后重新启动

## 种子数据

详见 [`database/README.md`](database/README.md) 完整说明。

**体验账号**：张三（默认）/ 李四 / 王五（导航栏下拉切换，无密码）  
**管理员账号**：`admin` / `admin123`（访问 `/Admin/Login`）

**座位数据**：8 个座位分布在 3 个区域（三楼自习区、四楼安静区、五楼电子阅览）、3 个楼层（3F/4F/5F）

**预约数据**：5 条预约覆盖已预约/已完成/已取消三种状态

## 项目目录说明

```
LibrarySeatReservation/
├── src/LibrarySeatReservation.Web/   # ASP.NET Core MVC 项目
│   ├── Controllers/                  # 4 个 Controller（Home/Seat/Reservation/Admin）
│   ├── Models/Entities/              # 4 个实体类 + 2 个枚举
│   ├── Models/ViewModels/            # 7 个 ViewModel
│   ├── Services/                     # 4 组接口+实现
│   ├── Data/                         # DbContext + DbInitializer（种子数据）
│   ├── Migrations/                   # EF Core 迁移文件
│   ├── Filters/                      # AdminOnlyAttribute（权限过滤器）
│   ├── Views/                        # 9 页面 + _Layout + _AdminLayout
│   ├── Program.cs                    # 启动配置（DI + Session + Migrate + Seed）
│   └── appsettings.json              # 连接字符串
├── database/                         # 数据库初始化说明
├── docs/                             # 17 份项目文档（需求→设计→开发→测试→交付）
├── prototype/                        # 静态 HTML 原型（9 页）
├── tests/                            # Playwright 自动测试
├── scripts/                          # 烟雾测试脚本
├── playwright.config.ts              # Playwright 配置（msedge channel）
└── package.json                      # Node.js 依赖
```

## 文档索引

| 文档 | 内容 |
|------|------|
| `docs/01` | 项目立项单 |
| `docs/02` | 需求分析与 MVP 确认 |
| `docs/03` | PRD-Lite |
| `docs/04` | 页面树与业务流程 |
| `docs/05` | 页面卡与 UI 规范 |
| `docs/06` | 静态原型与原型评审 |
| `docs/07` | 系统设计说明 |
| `docs/08` | 数据库设计 |
| `docs/09` | 关键链路详细设计 |
| `docs/10` | 开发准备与 Sprint 0 |
| `docs/11` | 开发前一致性总审计 |
| `docs/12` | 开发起步与骨架 |
| `docs/13` | 用户端主链路开发 |
| `docs/14` | 管理端与权限开发 |
| `docs/15` | 功能完善与体验优化 |
| `docs/16` | 联调测试与缺陷闭环 |
| `docs/17` | 交付说明与项目复盘 |
| `docs/项目任务板与迭代记录` | 全部 Sprint 任务跟踪 |

## 自动化测试

```bash
# 安装 Playwright（首次）
npm i -D @playwright/test

# 启动应用（另一个终端）
dotnet run --project src\LibrarySeatReservation.Web --urls http://localhost:5000

# 运行 Playwright 自动点击测试（19 用例）
npx playwright test tests/smoke.spec.ts --reporter=list

# 运行脚本烟雾测试（应用需已在运行）
node scripts/smoke.mjs
```

测试结果：Playwright 19/19 全部通过，脚本烟雾 7/7 全部通过（详见 `docs/16`）。

## 建议演示路径

```
用户端演示：
  首页 → 切换账号 → 座位列表（筛选+重置）→ 查看空闲座位详情 → 选择时段提交预约 → 我的预约查看 → 取消预约

管理端演示：
  /Admin/Login → 预约列表（状态筛选）→ 标记完成 → 座位管理（CRUD+状态切换）→ 统计页面 → 退出

跨端回流：
  管理员标记完成/座位状态变更 → 用户端我的预约/座位列表可见变化
```

## 已知限制

- 密码明文存储（课堂项目，建议后续使用 ASP.NET Core Identity）
- 无操作日志审计
- 无分页（演示数据量小）
- 不做移动端完整适配（管理端仅桌面）
- 管理员仅一个固定账号
- 早高峰时段并发预约无锁保护（课堂数据量级无需悲观锁）
- 浏览器兼容性以 Edge 为主，Chrome 手检正常，Firefox 未完整覆盖

## 仓库

- 远端地址：`https://github.com/zuiniuniiu/123`
- 最终 tag：`v1.0-final`
