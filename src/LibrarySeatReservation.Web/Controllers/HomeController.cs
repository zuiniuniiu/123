using Microsoft.AspNetCore.Mvc;
using LibrarySeatReservation.Web.Models;
using LibrarySeatReservation.Web.Models.ViewModels;
using LibrarySeatReservation.Web.Services;

namespace LibrarySeatReservation.Web.Controllers;

public class HomeController : Controller
{
    private readonly ISeatService _seatService;

    public HomeController(ISeatService seatService)
    {
        _seatService = seatService;
    }

    public async Task<IActionResult> Index()
    {
        var userName = HttpContext.Session.GetString("CurrentUser") ?? "张三";
        ViewBag.CurrentUser = userName;
        var recommended = await _seatService.GetAvailableSeatsAsync(5);

        return View(new HomeViewModel
        {
            CurrentUserName = userName,
            RecommendedSeats = recommended
        });
    }

    [HttpPost]
    public IActionResult SwitchUser(string userName)
    {
        HttpContext.Session.SetString("CurrentUser", userName);
        return RedirectToAction("Index");
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = System.Diagnostics.Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
