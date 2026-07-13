namespace LibrarySeatReservation.Web.Models.Entities;

public class Reservation
{
    public int Id { get; set; }
    public int SeatId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public DateTime ReservationDate { get; set; }
    public string TimeSlot { get; set; } = string.Empty;
    public ReservationStatus Status { get; set; } = ReservationStatus.Active;
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public Seat Seat { get; set; } = null!;
}
