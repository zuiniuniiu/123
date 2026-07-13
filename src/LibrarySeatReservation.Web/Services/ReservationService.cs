using Microsoft.EntityFrameworkCore;
using LibrarySeatReservation.Web.Data;
using LibrarySeatReservation.Web.Models.Entities;

namespace LibrarySeatReservation.Web.Services;

public class ReservationService : IReservationService
{
    private readonly AppDbContext _db;

    public ReservationService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<(bool Success, string Message)> CreateAsync(int seatId, string userName, DateTime date, string timeSlot)
    {
        var seat = await _db.Seats.FindAsync(seatId);
        if (seat == null) return (false, "座位不存在");
        if (seat.Status != SeatStatus.Available)
            return (false, seat.Status == SeatStatus.Maintenance ? "该座位正在维护中" : "该座位已被预约");
        if (date < DateTime.Today) return (false, "不能预约过去的日期");

        var conflict = await _db.Reservations.AnyAsync(r =>
            r.SeatId == seatId && r.ReservationDate == date && r.TimeSlot == timeSlot && r.Status == ReservationStatus.Active);

        if (conflict) return (false, "该时段已被预约，请选择其他时段");

        using var tx = await _db.Database.BeginTransactionAsync();
        try
        {
            var reservation = new Reservation
            {
                SeatId = seatId, UserName = userName, ReservationDate = date,
                TimeSlot = timeSlot, Status = ReservationStatus.Active, CreatedAt = DateTime.Now
            };
            _db.Reservations.Add(reservation);
            seat.Status = SeatStatus.Booked;
            await _db.SaveChangesAsync();
            await tx.CommitAsync();
            return (true, "预约成功");
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    public async Task<List<Reservation>> GetMyReservationsAsync(string userName)
    {
        return await _db.Reservations.Include(r => r.Seat)
            .Where(r => r.UserName == userName)
            .OrderByDescending(r => r.CreatedAt).ToListAsync();
    }

    public async Task<(bool Success, string Message)> CancelAsync(int reservationId, string userName)
    {
        var reservation = await _db.Reservations.Include(r => r.Seat)
            .FirstOrDefaultAsync(r => r.Id == reservationId);
        if (reservation == null) return (false, "预约记录不存在");
        if (reservation.UserName != userName) return (false, "只能取消自己的预约");
        if (reservation.Status != ReservationStatus.Active) return (false, "当前状态不允许取消");

        using var tx = await _db.Database.BeginTransactionAsync();
        try
        {
            reservation.Status = ReservationStatus.Cancelled;
            reservation.Seat.Status = SeatStatus.Available;
            await _db.SaveChangesAsync();
            await tx.CommitAsync();
            return (true, "已取消预约");
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }
    }

    public async Task<List<Reservation>> GetAllAsync(int? status)
    {
        var query = _db.Reservations.Include(r => r.Seat).AsQueryable();
        if (status.HasValue)
            query = query.Where(r => r.Status == (ReservationStatus)status.Value);
        return await query.OrderByDescending(r => r.CreatedAt).ToListAsync();
    }

    public async Task<bool> MarkCompletedAsync(int reservationId)
    {
        var reservation = await _db.Reservations.FindAsync(reservationId);
        if (reservation == null || reservation.Status != ReservationStatus.Active) return false;
        reservation.Status = ReservationStatus.Completed;

        var seat = await _db.Seats.FindAsync(reservation.SeatId);
        if (seat != null) seat.Status = SeatStatus.Available;

        await _db.SaveChangesAsync();
        return true;
    }
}
