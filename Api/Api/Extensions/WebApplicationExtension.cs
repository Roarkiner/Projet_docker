using Api.Routes;

namespace Api.Extensions;

public static class WebApplicationExtension
{
    public static WebApplication AjouterRouteAPI(this WebApplication _app)
    {
        _app.MapGroup("auth").AjouterRouteAuth();

        return _app;
    }
}
