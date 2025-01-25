using Api.Routes;

namespace Api.Extensions;

public static class WebApplicationExtension
{
    public static WebApplication AjouterRouteAPI(this WebApplication _app)
    {
        _app.MapGroup("auth").AjouterRouteAuth();
        _app.MapGroup("image").AjouterRouteImageLike();

        return _app;
    }
}
