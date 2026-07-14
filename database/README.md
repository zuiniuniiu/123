# 数据库初始化说明

## 方式：Code First（EF Core 迁移）

本项目使用 **Entity Framework Core Code First** 方式管理数据库。所有表结构通过 C# 实体类定义，迁移文件由 EF Core 自动生成。

---

## 首次建库建表

项目启动时 **自动执行**，无需手动操作：

```bash
# 仅需运行项目即可
dotnet run --project src\LibrarySeatReservation.Web
```

启动后 Program.cs 会依次执行：

1. `db.Database.Migrate()` — 应用所有未执行的迁移，自动建库建表
2. `DbInitializer.Seed(db)` — 填充种子数据（仅首次运行）

### 手动重建数据库

```bash
# 删除数据库
dotnet ef database drop --project src\LibrarySeatReservation.Web

# 重新创建
dotnet ef database update --project src\LibrarySeatReservation.Web

# 或直接启动项目（自动 Migrate + Seed）
dotnet run --project src\LibrarySeatReservation.Web
```

---

## 种子数据

种子数据在 `src/LibrarySeatReservation.Web/Data/DbInitializer.cs` 中定义，启动时自动填充。

### 3 个体验账号

| 姓名 | 用途 |
|------|------|
| 张三 | 默认登录用户 |
| 李四 | 切换体验 |
| 王五 | 切换体验 |

### 8 个座位

| 编号 | 区域 | 楼层 | 状态 |
|------|------|------|------|
| A-01 | 三楼自习区 | 3F | ✅ 空闲 |
| A-02 | 三楼自习区 | 3F | 🔵 已预约 |
| A-03 | 三楼自习区 | 3F | ✅ 空闲 |
| B-01 | 四楼安静区 | 4F | 🛠 维护中 |
| B-02 | 四楼安静区 | 4F | ✅ 空闲 |
| B-03 | 四楼安静区 | 4F | ✅ 空闲 |
| C-01 | 五楼电子阅览 | 5F | 🔵 已预约 |
| C-02 | 五楼电子阅览 | 5F | ✅ 空闲 |

### 5 条预约记录

| 用户 | 座位 | 日期 | 时段 | 状态 |
|------|------|------|------|------|
| 张三 | A-01 | 今天 | 08:00-12:00 | 已预约 |
| 李四 | C-01 | 今天 | 14:00-18:00 | 已预约 |
| 张三 | B-02 | 昨天 | 14:00-18:00 | 已完成 |
| 王五 | A-02 | 前天 | 18:00-21:00 | 已取消 |
| 李四 | C-02 | 3 天前 | 08:00-12:00 | 已完成 |

### 1 个管理员

| 用户名 | 密码 | 说明 |
|--------|------|------|
| admin | admin123 | 访问 `/Admin/Login` 登录 |

---

## 数据库连接字符串

默认使用 SQL Server LocalDB，配置在 `appsettings.json`：

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=LibrarySeatReservation;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

如需切换数据库（如 SQL Server 远程实例），修改此连接字符串即可。

---

## 实体关系

```
Seat (1) ────< Reservation (N) >──── SimulatedUser (参考)
Admin (独立表，无外键)
```

- `Seat` ↔ `Reservation`：一对多（一个座位可有多条预约记录）
- `Reservation.UserName`：字符串字段，关联 `SimulatedUser.Name`（逻辑关联，非外键约束）
- `Admin`：独立表，仅存储管理员登录凭证

---

## 迁移文件

位置：`src/LibrarySeatReservation.Web/Migrations/`

迁移由以下命令生成：

```bash
dotnet ef migrations add InitialCreate --project src\LibrarySeatReservation.Web
```
