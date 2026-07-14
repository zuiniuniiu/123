# 图书馆座位预约系统 · 开发准备与 Sprint 0

## 1. 开发环境确认

| 项目 | 要求 | 确认人 |
|------|------|--------|
| .NET 8 SDK | ≥ 8.0.0 | 待确认 |
| Visual Studio 2022 / VS Code | 安装 ASP.NET 和 Web 开发工作负载 | 待确认 |
| SQL Server LocalDB | 随 VS 安装或单独安装 | 待确认 |
| Git | ≥ 2.30 | 待确认 |
| 浏览器 | Chrome / Edge 最新版 | 待确认 |

## 2. 分支策略

```
main          —— 稳定分支，仅通过 PR 合并
  └── dev     —— 开发分支，日常开发从此切出
       ├── feat/user-home          —— P01 首页
       ├── feat/seat-list          —— P02 座位列表
       ├── feat/seat-detail        —— P03 座位详情
       ├── feat/reservation-create —— P04 预约提交
       ├── feat/my-reservations    —— P05 我的预约
       ├── feat/admin-login        —— P06 管理登录
       ├── feat/admin-reservation  —— P07 预约管理
       ├── feat/admin-seat         —— P08 座位管理
       ├── feat/admin-statistics   —— P09 统计页
       └── fix/*                   —— Bug 修复分支
```

**规则：**
- `main` 受保护，禁止直接 push
- 功能分支从 `dev` 切出，完成后 PR → `dev`
- `dev` 累积足够功能后 PR → `main`
- commit message 使用 `type(scope): message` 格式，如 `feat(seat): add seat list with filtering`

## 3. Sprint 粗计划

| Sprint | 周期 | 目标 | 交付物 |
|--------|------|------|--------|
| Sprint 0 | 第 1 周前半 | 项目骨架搭建、数据库初始化、首次构建运行 | .sln, .csproj, DbContext, Seed Data, 首次 build 通过 |
| Sprint 1 | 第 1 周末 ~ 第 2 周中 | 用户端 5 页（P01~P05） | 首页、座位列表、座位详情、预约提交、我的预约 + 取消 |
| Sprint 2 | 第 2 周末 ~ 第 3 周中 | 管理端 4 页（P06~P09） | 登录、预约管理、座位管理、统计页 |
| Sprint 3 | 第 3 周末 ~ 第 4 周 | 联调、Bug 修复、部署验收 | 全功能可运行 + GitHub/Gitee 推送 |

> Sprint 1~4 为主 Sprint，可多轮推进，不强制一个 Sprint 完成所有任务。

## 4. Sprint 0 任务卡

| ID | 任务 | 验收标准 | 预估工时 |
|----|------|----------|----------|
| S0-01 | 创建 .sln 解决方案 | `dotnet new sln -n SeatBook` 成功 | 0.5h |
| S0-02 | 创建 .csproj Web 项目 | `dotnet new mvc -n SeatBook`，引用 EF Core + SqlServer 包 | 0.5h |
| S0-03 | 添加项目引用到解决方案 | `dotnet sln add SeatBook/SeatBook.csproj` | 0.2h |
| S0-04 | 创建实体类（Seat / Reservation / SimulatedUser / Admin） | 4 个 Model 类，字段与 docs/08 一致 | 1h |
| S0-05 | 创建 AppDbContext + DbSet 配置 | DbContext 含 4 个 DbSet，配置索引与默认值 | 0.5h |
| S0-06 | 创建 Seed Data 初始器 | DbInitializer 生成 3 用户 + 15~20 座位 + 5~8 预约 + 1 管理员 | 1h |
| S0-07 | 配置 Program.cs（DI 注册 + EnsureCreated）| 注册 Service、DbContext、Session，启动时调用 Seed | 0.5h |
| S0-08 | 首次 build 通过并运行 | `dotnet build` 无错误，`dotnet run` 可访问首页 | 0.5h |
| S0-09 | 创建 .gitignore | 排除 bin/obj/node_modules/.vs/ | 0.2h |
| S0-10 | Git 初始化并首次提交 | `git init → add → commit`，commit message: "chore: 项目骨架与数据库初始化" | 0.2h |
| S0-11 | （可选）推送远端仓库 | 如有远端地址则推送 | 0.2h |

**Sprint 0 完成条件：** `dotnet build` 通过 + 浏览器可访问首页 + 数据库自动创建 + 种子数据可见。

## 5. 项目初始化命令（备忘）

```bash
# 创建解决方案
dotnet new sln -n SeatBook

# 创建 Web 项目
dotnet new mvc -n SeatBook
cd SeatBook

# 添加 NuGet 包
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools

# 回到根目录，添加项目引用
cd ..
dotnet sln add SeatBook/SeatBook.csproj

# 验证
dotnet build
```

## 6. 首次 Git 留痕

```bash
git init
git add .
git commit -m "chore: 项目初始化，含文档与静态原型"

# 如有远端仓库
# git remote add origin <仓库地址>
# git push -u origin main
```

> 当前仓库已关联远端（地址见 README §144），推送命令参考 §5 中的 git push 操作。

## 7. 已知假设与约束

| 假设 | 说明 |
|------|------|
| .NET 8 SDK 已安装 | 未安装则先下载安装 |
| SQL Server LocalDB 可用 | 如不可用，回退方案：改用 SQLite |
| 不启用 HTTPS 证书信任 | 开发阶段使用 HTTP |
| 不配置 CI/CD | 课堂项目仅需本地运行 |
| 不配置 Docker | 本地开发环境 |
| 不做自动化测试覆盖 | 仅手动测试 |

## 8. 开发注意事项

- 每完成一个功能分支，立即手动测试该页面，不积压 Bug
- Controller 保持轻薄，业务逻辑写在 Service 层
- View 中不写复杂 C# 代码，逻辑放在 ViewModel
- 表结构变更时手动同步 Model 和 Seed Data，不做 Migration

---

**前置文档**：docs/09-关键链路详细设计.md  
**本文件**：docs/10-开发准备与Sprint0.md  
**后续阶段**：开发起步与项目骨架（Sprint 1 编码）
