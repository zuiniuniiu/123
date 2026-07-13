using Microsoft.EntityFrameworkCore;
using LibrarySeatReservation.Web.Data;
using LibrarySeatReservation.Web.Models.Entities;

namespace LibrarySeatReservation.Web.Services;

public class SeatService : ISeatService
{
    private readonly AppDbContext _db;

    public SeatService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Seat>> GetAvailableSeatsAsync(int count = 5)
    {
        return await _db.Seats.Where(s => s.Status == SeatStatus.Available).Take(count).ToListAsync();
    }

    public async Task<List<Seat>> GetAllAsync(string? area, string? floor)
    {
        var query = _db.Seats.AsQueryable();
        if (!string.IsNullOrEmpty(area))
            query = query.Where(s => s.Area == area);
        if (!string.IsNullOrEmpty(floor))
            query = query.Where(s => s.Floor == floor);
        return await query.ToListAsync();
    }

    public async Task<List<string>> GetAreasAsync()
    {
        return await _db.Seats.Select(s => s.Area).Distinct().OrderBy(a => a).ToListAsync();
    }

    public async Task<List<string>> GetFloorsAsync()
    {
        return await _db.Seats.Select(s => s.Floor).Distinct().OrderBy(f => f).ToListAsync();
    }

    public async Task<Seat?> GetByIdAsync(int id)
    {
        return await _db.Seats.FindAsync(id);
    }

    public async Task<List<string>> GetBookedSlotsAsync(int seatId, DateTime date)
    {
        return await _db.Reservations
            .Where(r => r.SeatId == seatId && r.ReservationDate == date && r.Status == ReservationStatus.Active)
            .Select(r => r.TimeSlot)
            .ToListAsync();
    }
}
