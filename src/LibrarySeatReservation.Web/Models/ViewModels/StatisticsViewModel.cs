namespace LibrarySeatReservation.Web.Models.ViewModels;

public class StatisticsViewModel
{
    public int TotalSeats { get; set; }
    public int TodayReservations { get; set; }
    public int MonthReservations { get; set; }
    public List<TimeSlotStat> TimeSlotDistribution { get; set; } = new();
}

public class TimeSlotStat
{
    public string TimeSlot { get; set; } = string.Empty;
    public int Count { get; set; }
}
