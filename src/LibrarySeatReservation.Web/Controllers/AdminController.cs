using Microsoft.AspNetCore.Mvc;
using LibrarySeatReservation.Web.Models.Entities;
using LibrarySeatReservation.Web.Models.ViewModels;
using LibrarySeatReservation.Web.Services;

namespace LibrarySeatReservation.Web.Controllers;

public class AdminController : Controller
{
    private readonly IAdminService _adminService;
    private readonly IReservationService _reservationService;
    private readonly IStatisticsService _statisticsService;

    public AdminController(IAdminService adminService, IReservationService reservationService, IStatisticsService statisticsService)
    {
        _adminService = adminService;
        _reservationService = reservationService;
        _statisticsService = statisticsService;
    }

    [HttpGet]
    public IActionResult Login()
    {
        if (HttpContext.Session.GetString("IsAdmin") == "true")
            return RedirectToAction("Reservation");
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> Login(AdminLoginViewModel model)
    {
        if (await _adminService.LoginAsync(model.Username, model.Password))
        {
            HttpContext.Session.SetString("IsAdmin", "true");
            HttpContext.Session.SetString("AdminUser", model.Username);
            return RedirectToAction("Reservation");
        }

        TempData["Error"] = "用户名或密码错误";
        return View(model);
    }

    [HttpPost]
    public IActionResult Logout()
    {
        HttpContext.Session.Remove("IsAdmin");
        HttpContext.Session.Remove("AdminUser");
        return RedirectToAction("Login");
    }

    public async Task<IActionResult> Reservation(int? status)
    {
        if (HttpContext.Session.GetString("IsAdmin") != "true") return RedirectToAction("Login");
        var reservations = await _reservationService.GetAllAsync(status);
        return View(reservations);
    }

    [HttpPost]
    public async Task<IActionResult> MarkCompleted(int id)
    {
        if (HttpContext.Session.GetString("IsAdmin") != "true") return RedirectToAction("Login");
        var success = await _reservationService.MarkCompletedAsync(id);
        if (success) TempData["Success"] = "已标记为已完成";
        else TempData["Error"] = "操作失败";
        return RedirectToAction("Reservation");
    }

    public async Task<IActionResult> Seat()
    {
        if (HttpContext.Session.GetString("IsAdmin") != "true") return RedirectToAction("Login");
        var seats = await _adminService.GetAllSeatsAsync();
        return View(seats);
    }

    [HttpPost]
    public async Task<IActionResult> AddSeat(Seat seat)
    {
        if (HttpContext.Session.GetString("IsAdmin") != "true") return RedirectToAction("Login");
        await _adminService.AddSeatAsync(seat);
        TempData["Success"] = "座位已添加";
        return RedirectToAction("Seat");
    }

    [HttpPost]
    public async Task<IActionResult> EditSeat(Seat seat)
    {
        if (HttpContext.Session.GetString("IsAdmin") != "true") return RedirectToAction("Login");
        await _adminService.UpdateSeatAsync(seat);
        TempData["Success"] = "座位已更新";
        return RedirectToAction("Seat");
    }

    [HttpPost]
    public async Task<IActionResult> DeleteSeat(int id)
    {
        if (HttpContext.Session.GetString("IsAdmin") != "true") return RedirectToAction("Login");
        var (success, message) = await _adminService.DeleteSeatAsync(id);
        if (success) TempData["Success"] = message;
        else TempData["Error"] = message;
        return RedirectToAction("Seat");
    }

    [HttpPost]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        if (HttpContext.Session.GetString("IsAdmin") != "true") return RedirectToAction("Login");
        var success = await _adminService.ToggleSeatStatusAsync(id);
        if (success) TempData["Success"] = "状态已切换";
        else TempData["Error"] = "操作失败（已预约座位不可切换）";
        return RedirectToAction("Seat");
    }

    public async Task<IActionResult> Statistics()
    {
        if (HttpContext.Session.GetString("IsAdmin") != "true") return RedirectToAction("Login");
        var vm = await _statisticsService.GetStatisticsAsync();
        return View(vm);
    }
}
