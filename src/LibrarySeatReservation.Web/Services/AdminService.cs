using Microsoft.EntityFrameworkCore;
using LibrarySeatReservation.Web.Data;
using LibrarySeatReservation.Web.Models.Entities;

namespace LibrarySeatReservation.Web.Services;

public class AdminService : IAdminService
{
    private readonly AppDbContext _db;

    public AdminService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<bool> LoginAsync(string username, string password)
    {
        return await _db.Admins.AnyAsync(a => a.Username == username && a.Password == password);
    }

    public async Task<List<Seat>> GetAllSeatsAsync()
    {
        return await _db.Seats.OrderBy(s => s.Id).ToListAsync();
    }

    public async Task<bool> AddSeatAsync(Seat seat)
    {
        _db.Seats.Add(seat);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateSeatAsync(Seat seat)
    {
        var existing = await _db.Seats.FindAsync(seat.Id);
        if (existing == null) return false;
        existing.SeatNumber = seat.SeatNumber;
        existing.Area = seat.Area;
        existing.Floor = seat.Floor;
        existing.Description = seat.Description;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<(bool Success, string Message)> DeleteSeatAsync(int seatId)
    {
        var hasReservations = await _db.Reservations.AnyAsync(r => r.SeatId == seatId);
        if (hasReservations) return (false, "该座位有关联预约记录，无法删除");
        var seat = await _db.Seats.FindAsync(seatId);
        if (seat == null) return (false, "座位不存在");
        _db.Seats.Remove(seat);
        await _db.SaveChangesAsync();
        return (true, "已删除");
    }

    public async Task<bool> ToggleSeatStatusAsync(int seatId)
    {
        var seat = await _db.Seats.FindAsync(seatId);
        if (seat == null || seat.Status == SeatStatus.Booked) return false;
        seat.Status = seat.Status == SeatStatus.Available ? SeatStatus.Maintenance : SeatStatus.Available;
        await _db.SaveChangesAsync();
        return true;
    }
}
