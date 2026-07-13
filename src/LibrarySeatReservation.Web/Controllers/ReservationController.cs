using Microsoft.AspNetCore.Mvc;
using LibrarySeatReservation.Web.Models.ViewModels;
using LibrarySeatReservation.Web.Services;

namespace LibrarySeatReservation.Web.Controllers;

public class ReservationController : Controller
{
    private readonly IReservationService _reservationService;
    private readonly ISeatService _seatService;

    public ReservationController(IReservationService reservationService, ISeatService seatService)
    {
        _reservationService = reservationService;
        _seatService = seatService;
    }

    [HttpGet]
    public async Task<IActionResult> Create(int seatId, DateTime? ReservationDate, string? TimeSlot)
    {
        var userName = HttpContext.Session.GetString("CurrentUser") ?? "张三";
        ViewBag.CurrentUser = userName;
        var seat = await _seatService.GetByIdAsync(seatId);
        if (seat == null)
        {
            TempData["Error"] = "请先选择一个座位";
            return RedirectToAction("Index", "Seat");
        }

        var timeSlots = new List<string> { "08:00-12:00", "14:00-18:00", "18:00-21:00" };
        var selectedDate = ReservationDate ?? DateTime.Today;
        if (selectedDate < DateTime.Today) selectedDate = DateTime.Today;

        return View(new ReservationCreateViewModel
        {
            SeatId = seat.Id,
            SeatNumber = seat.SeatNumber,
            Area = seat.Area,
            Floor = seat.Floor,
            UserName = userName,
            ReservationDate = selectedDate,
            TimeSlot = TimeSlot ?? string.Empty,
            TimeSlots = timeSlots
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create(ReservationCreateViewModel model)
    {
        var userName = HttpContext.Session.GetString("CurrentUser") ?? "张三";
        ViewBag.CurrentUser = userName;
        var (success, message) = await _reservationService.CreateAsync(model.SeatId, userName, model.ReservationDate, model.TimeSlot);

        if (success)
        {
            TempData["Success"] = message;
            return RedirectToAction("MyReservations");
        }

        TempData["Error"] = message;
        var seat = await _seatService.GetByIdAsync(model.SeatId);
        if (seat != null)
        {
            model.SeatNumber = seat.SeatNumber;
            model.Area = seat.Area;
            model.Floor = seat.Floor;
        }
        model.TimeSlots = new List<string> { "08:00-12:00", "14:00-18:00", "18:00-21:00" };
        return View(model);
    }

    public async Task<IActionResult> MyReservations()
    {
        var userName = HttpContext.Session.GetString("CurrentUser") ?? "张三";
        ViewBag.CurrentUser = userName;
        var reservations = await _reservationService.GetMyReservationsAsync(userName);

        return View(new MyReservationsViewModel
        {
            CurrentUserName = userName,
            Reservations = reservations
        });
    }

    [HttpPost]
    public async Task<IActionResult> Cancel(int id)
    {
        var userName = HttpContext.Session.GetString("CurrentUser") ?? "张三";
        var (success, message) = await _reservationService.CancelAsync(id, userName);

        if (success) TempData["Success"] = message;
        else TempData["Error"] = message;

        return RedirectToAction("MyReservations");
    }
}
