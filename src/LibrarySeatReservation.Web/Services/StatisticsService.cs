using Microsoft.EntityFrameworkCore;
using LibrarySeatReservation.Web.Data;
using LibrarySeatReservation.Web.Models.Entities;
using LibrarySeatReservation.Web.Models.ViewModels;

namespace LibrarySeatReservation.Web.Services;

public class StatisticsService : IStatisticsService
{
    private readonly AppDbContext _db;

    public StatisticsService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<StatisticsViewModel> GetStatisticsAsync()
    {
        var totalSeats = await _db.Seats.CountAsync();
        var today = DateTime.Today;
        var todayReservations = await _db.Reservations.CountAsync(r => r.ReservationDate == today && r.Status == ReservationStatus.Active);
        var monthStart = new DateTime(today.Year, today.Month, 1);
        var monthEnd = monthStart.AddMonths(1).AddDays(-1);
        var monthReservations = await _db.Reservations.CountAsync(r => r.ReservationDate >= monthStart && r.ReservationDate <= monthEnd && r.Status == ReservationStatus.Active);
        var timeSlotDistribution = await _db.Reservations.GroupBy(r => r.TimeSlot)
            .Select(g => new TimeSlotStat { TimeSlot = g.Key, Count = g.Count() }).ToListAsync();

        return new StatisticsViewModel
        {
            TotalSeats = totalSeats,
            TodayReservations = todayReservations,
            MonthReservations = monthReservations,
            TimeSlotDistribution = timeSlotDistribution
        };
    }
}
