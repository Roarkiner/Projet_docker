using System.Security.Claims;

namespace Api.Extensions;

public static class HttpContextExtension
{
    /// <summary>
    /// Recupere l'id publique dans le JWT
    /// </summary>
    /// <param name="_httpContext"></param>
    /// <returns>Id publique de l'utilisateur</returns>
    public static int RecupererId(this HttpContext _httpContext) => int.Parse(_httpContext.User.FindFirstValue("id")!);

}
