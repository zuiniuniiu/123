using LibrarySeatReservation.Web.Models.ViewModels;

namespace LibrarySeatReservation.Web.Services;

public interface IStatisticsService
{
    Task<StatisticsViewModel> GetStatisticsAsync();
}
