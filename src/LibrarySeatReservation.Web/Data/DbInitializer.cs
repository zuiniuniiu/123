using LibrarySeatReservation.Web.Models.Entities;

namespace LibrarySeatReservation.Web.Data;

public static class DbInitializer
{
    public static void Seed(AppDbContext db)
    {
        if (db.SimulatedUsers.Any()) return;

        db.SimulatedUsers.AddRange(
            new SimulatedUser { Name = "张三", DisplayOrder = 1 },
            new SimulatedUser { Name = "李四", DisplayOrder = 2 },
            new SimulatedUser { Name = "王五", DisplayOrder = 3 }
        );

        db.Admins.Add(new Admin { Username = "admin", Password = "admin123" });

        db.Seats.AddRange(
            new Seat { SeatNumber = "A-01", Area = "三楼自习区", Floor = "3F", Description = "靠窗，光线好，安静", Status = SeatStatus.Available },
            new Seat { SeatNumber = "A-02", Area = "三楼自习区", Floor = "3F", Description = "中间位置", Status = SeatStatus.Booked },
            new Seat { SeatNumber = "A-03", Area = "三楼自习区", Floor = "3F", Description = "靠门", Status = SeatStatus.Available },
            new Seat { SeatNumber = "B-01", Area = "四楼安静区", Floor = "4F", Description = "靠窗，适合专注学习", Status = SeatStatus.Maintenance },
            new Seat { SeatNumber = "B-02", Area = "四楼安静区", Floor = "4F", Description = "中间位置，有台灯", Status = SeatStatus.Available },
            new Seat { SeatNumber = "B-03", Area = "四楼安静区", Floor = "4F", Description = "后排角落，安静", Status = SeatStatus.Available },
            new Seat { SeatNumber = "C-01", Area = "五楼电子阅览", Floor = "5F", Description = "有电源插座", Status = SeatStatus.Booked },
            new Seat { SeatNumber = "C-02", Area = "五楼电子阅览", Floor = "5F", Description = "有电源插座，靠窗", Status = SeatStatus.Available }
        );

        db.SaveChanges();

        var seats = db.Seats.ToDictionary(s => s.SeatNumber);
        db.Reservations.AddRange(
            new Reservation { SeatId = seats["A-01"].Id, UserName = "张三", ReservationDate = DateTime.Today, TimeSlot = "08:00-12:00", Status = ReservationStatus.Active, CreatedAt = DateTime.Now.AddHours(-2) },
            new Reservation { SeatId = seats["C-01"].Id, UserName = "李四", ReservationDate = DateTime.Today, TimeSlot = "14:00-18:00", Status = ReservationStatus.Active, CreatedAt = DateTime.Now.AddHours(-3) },
            new Reservation { SeatId = seats["B-02"].Id, UserName = "张三", ReservationDate = DateTime.Today.AddDays(-1), TimeSlot = "14:00-18:00", Status = ReservationStatus.Completed, CreatedAt = DateTime.Now.AddDays(-1).AddHours(-2) },
            new Reservation { SeatId = seats["A-02"].Id, UserName = "王五", ReservationDate = DateTime.Today.AddDays(-2), TimeSlot = "18:00-21:00", Status = ReservationStatus.Cancelled, CreatedAt = DateTime.Now.AddDays(-2).AddHours(-3) },
            new Reservation { SeatId = seats["C-02"].Id, UserName = "李四", ReservationDate = DateTime.Today.AddDays(-3), TimeSlot = "08:00-12:00", Status = ReservationStatus.Completed, CreatedAt = DateTime.Now.AddDays(-3).AddHours(-4) }
        );

        db.SaveChanges();
    }
}
