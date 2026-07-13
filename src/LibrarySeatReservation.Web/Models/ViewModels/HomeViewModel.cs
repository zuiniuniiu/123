using LibrarySeatReservation.Web.Models.Entities;

namespace LibrarySeatReservation.Web.Models.ViewModels;

public class HomeViewModel
{
    public string CurrentUserName { get; set; } = "张三";
    public List<Seat> RecommendedSeats { get; set; } = new();
}
