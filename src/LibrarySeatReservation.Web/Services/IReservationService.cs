using LibrarySeatReservation.Web.Models.Entities;

namespace LibrarySeatReservation.Web.Services;

public interface IReservationService
{
    Task<(bool Success, string Message)> CreateAsync(int seatId, string userName, DateTime date, string timeSlot);
    Task<List<Reservation>> GetMyReservationsAsync(string userName);
    Task<(bool Success, string Message)> CancelAsync(int reservationId, string userName);
    Task<List<Reservation>> GetAllAsync(int? status);
    Task<bool> MarkCompletedAsync(int reservationId);
}
