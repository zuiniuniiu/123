using LibrarySeatReservation.Web.Models.Entities;

namespace LibrarySeatReservation.Web.Models.ViewModels;

public class SeatListViewModel
{
    public string? SelectedArea { get; set; }
    public string? SelectedFloor { get; set; }
    public List<string> Areas { get; set; } = new();
    public List<string> Floors { get; set; } = new();
    public List<Seat> Seats { get; set; } = new();
}
