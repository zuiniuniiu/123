using Microsoft.AspNetCore.Mvc;
using LibrarySeatReservation.Web.Models.ViewModels;
using LibrarySeatReservation.Web.Services;

namespace LibrarySeatReservation.Web.Controllers;

public class SeatController : Controller
{
    private readonly ISeatService _seatService;

    public SeatController(ISeatService seatService)
    {
        _seatService = seatService;
    }

    public async Task<IActionResult> Index(string? area, string? floor)
    {
        var seats = await _seatService.GetAllAsync(area, floor);
        var areas = await _seatService.GetAreasAsync();
        var floors = await _seatService.GetFloorsAsync();

        return View(new SeatListViewModel
        {
            Seats = seats,
            SelectedArea = area,
            SelectedFloor = floor,
            Areas = areas,
            Floors = floors
        });
    }

    public async Task<IActionResult> Detail(int id, DateTime? date)
    {
        ViewBag.CurrentUser = HttpContext.Session.GetString("CurrentUser") ?? "张三";
        var seat = await _seatService.GetByIdAsync(id);
        if (seat == null) return NotFound();

        var selectedDate = date ?? DateTime.Today;
        if (selectedDate < DateTime.Today) selectedDate = DateTime.Today;

        var timeSlots = new List<string> { "08:00-12:00", "14:00-18:00", "18:00-21:00" };
        var bookedSlots = await _seatService.GetBookedSlotsAsync(id, selectedDate);

        var slotAvailability = new Dictionary<string, bool>();
        foreach (var slot in timeSlots)
        {
            slotAvailability[slot] = !bookedSlots.Contains(slot);
        }

        return View(new SeatDetailViewModel
        {
            Seat = seat,
            TimeSlots = timeSlots,
            SlotAvailability = slotAvailability,
            SelectedDate = selectedDate
        });
    }
}
