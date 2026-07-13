using LibrarySeatReservation.Web.Models.Entities;

namespace LibrarySeatReservation.Web.Services;

public interface ISeatService
{
    Task<List<Seat>> GetAvailableSeatsAsync(int count = 5);
    Task<List<Seat>> GetAllAsync(string? area, string? floor);
    Task<List<string>> GetAreasAsync();
    Task<List<string>> GetFloorsAsync();
    Task<Seat?> GetByIdAsync(int id);
    Task<List<string>> GetBookedSlotsAsync(int seatId, DateTime date);
}
