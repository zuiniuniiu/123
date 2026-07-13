using LibrarySeatReservation.Web.Models.Entities;

namespace LibrarySeatReservation.Web.Models.ViewModels;

public class MyReservationsViewModel
{
    public string CurrentUserName { get; set; } = string.Empty;
    public List<Reservation> Reservations { get; set; } = new();
}
