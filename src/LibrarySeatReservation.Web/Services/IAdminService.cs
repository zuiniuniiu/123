using LibrarySeatReservation.Web.Models.Entities;

namespace LibrarySeatReservation.Web.Services;

public interface IAdminService
{
    Task<bool> LoginAsync(string username, string password);
    Task<List<Seat>> GetAllSeatsAsync();
    Task<bool> AddSeatAsync(Seat seat);
    Task<bool> UpdateSeatAsync(Seat seat);
    Task<(bool Success, string Message)> DeleteSeatAsync(int seatId);
    Task<bool> ToggleSeatStatusAsync(int seatId);
}
