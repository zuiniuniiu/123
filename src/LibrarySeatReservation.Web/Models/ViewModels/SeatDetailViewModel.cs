using LibrarySeatReservation.Web.Models.Entities;

namespace LibrarySeatReservation.Web.Models.ViewModels;

public class SeatDetailViewModel
{
    public Seat Seat { get; set; } = null!;
    public List<string> TimeSlots { get; set; } = new();
    public Dictionary<string, bool> SlotAvailability { get; set; } = new();
    public DateTime SelectedDate { get; set; } = DateTime.Today;
}
