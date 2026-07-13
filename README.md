# SeatBook - 图书馆座位预约系统

## 项目简介

SeatBook 是一个基于 ASP.NET Core MVC 的轻量图书馆座位预约系统。学生可以在线浏览空闲座位、预约座位、管理自己的预约；管理员可以维护座位信息、查看预约情况和统计数据。

> 课堂项目 · .NET 8 + Razor + SQL Server LocalDB + EF Core + Bootstrap

---

## 技术栈

| 层面 | 选型 |
|------|------|
| 后端框架 | ASP.NET Core MVC (.NET 8) |
| 视图引擎 | Razor (.cshtml) |
| 数据库 | SQL Server LocalDB |
| ORM | EF Core 8 |
| 前端 | Bootstrap 5.3 + 自定义 CSS |
| 认证 | Session（管理端）+ Cookie（用户端） |

---

## 目录结构

### 当前已存在（本阶段产物）

```
SeatBook/
├── docs/                              # 项目文档
│   ├── 01-项目立项单.md
│   ├── 02-需求分析与MVP确认.md
│   ├── 03-PRD-Lite.md
│   ├── 04-页面树与业务流程.md
│   ├── 05-页面卡与UI规范.md
│   ├── 06-静态原型与原型评审.md
│   ├── 07-系统设计说明.md
│   ├── 08-数据库设计.md
│   ├── 09-关键链路详细设计.md
│   ├── 10-开发准备与Sprint0.md
│   └── 项目任务板与迭代记录.md
├── prototype/static-v1/               # 静态原型
│   ├── index.html                     # 用户首页
│   ├── seat-list.html                 # 座位列表
│   ├── seat-detail.html               # 座位详情
│   ├── reservation-create.html        # 预约提交
│   ├── my-reservations.html           # 我的预约
│   ├── admin-login.html               # 管理员登录
│   ├── admin-reservations.html        # 预约管理
│   ├── admin-seats.html               # 座位管理
│   ├── admin-statistics.html          # 统计页
│   ├── css/seatbook.css               # 自定义样式
│   └── js/seatbook.js                 # 交互脚本
├── prototype/review-1/
│   └── 原型评审清单.md
├── README.md                          # 本文件
└── .gitignore
```

### 后续计划 / 待生成（开发阶段创建）

```
SeatBook/                              # ASP.NET Core MVC 项目根
├── SeatBook.sln                       # 解决方案文件
├── SeatBook/                          # Web 项目目录
│   ├── Controllers/                   # Controller 层
│   ├── Models/
│   │   ├── Entities/                  # EF Core 实体
│   │   └── ViewModels/                # 视图模型
│   ├── Services/                      # 业务逻辑层
│   ├── Data/                          # DbContext + Seed
│   ├── Views/                         # Razor 视图
│   ├── wwwroot/                       # 静态资源
│   ├── Program.cs                     # 启动配置
│   └── appsettings.json               # 配置文件
└── README.md                          # （同上，后续增量更新）
```

---

## 运行前提

- Windows 10 / 11
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)（≥ 8.0.0）
- Visual Studio 2022 或 VS Code + C# 扩展
- SQL Server LocalDB（随 Visual Studio 安装或单独安装）
- Git

---

## 当前阶段

📌 **开发准备与 Sprint 0 阶段** — 项目文档已完成，静态原型已确认，即将进入编码。

当前仓库包含：
- ✅ 全部 9 份需求与设计文档（docs/）
- ✅ 9 页静态 HTML 原型（prototype/static-v1/）
- ✅ 原型评审清单（prototype/review-1/）
- ✅ 开发准备与 Sprint 计划（docs/10-开发准备与Sprint0.md）
- ✅ 任务板与迭代记录（docs/项目任务板与迭代记录.md）

---

## 已实现范围

> 待开发阶段持续更新

- [ ] Sprint 0 — 项目骨架搭建、数据库初始化、首次构建运行
- [ ] Sprint 1 — 用户端 5 页面（首页、座位列表、座位详情、预约提交、我的预约）
- [ ] Sprint 2 — 管理端 4 页面（登录、预约管理、座位管理、统计页）
- [ ] Sprint 3 — 联调、Bug 修复、部署验收

---

## 数据库初始化方式

启动时自动建库 + 填充 Seed Data（模拟数据），无需手动执行 SQL 脚本。

运行后访问任意页面即可触发 `EnsureCreated()` + `DbInitializer.Seed()`。

---

## 演示账号

| 角色 | 账号 | 密码 | 说明 |
|------|------|------|------|
| 体验用户 | 张三 / 李四 / 王五 | 无密码 | 导航栏下拉切换 |
| 管理员 | admin | admin123 | 访问 /Admin/Login |

---

## 已知限制

- 密码明文存储（课堂项目）
- 无 CSRF 防护（课堂项目）
- 无操作日志审计
- 无分页（演示数据量小）
- 不做移动端完整适配（管理端仅桌面）

---

## 仓库

- 远端地址：（待补）
- 首次提交记录：`git init → git add . → git commit -m "chore: 项目初始化，含文档与静态原型"`
