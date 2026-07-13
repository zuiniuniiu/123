namespace LibrarySeatReservation.Web.Models.Entities;

public class Seat
{
    public int Id { get; set; }
    public string SeatNumber { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Floor { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public SeatStatus Status { get; set; } = SeatStatus.Available;
}
