namespace LibrarySeatReservation.Web.Models.ViewModels;

public class ReservationCreateViewModel
{
    public int SeatId { get; set; }
    public string SeatNumber { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Floor { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime ReservationDate { get; set; } = DateTime.Today;
    public string TimeSlot { get; set; } = string.Empty;
    public List<string> TimeSlots { get; set; } = new();
}
