using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace LibrarySeatReservation.Web.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AdminOnlyAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var isAdmin = context.HttpContext.Session.GetString("IsAdmin");
        if (isAdmin != "true")
        {
            context.Result = new RedirectToActionResult("Login", "Admin", null);
        }
    }
}
