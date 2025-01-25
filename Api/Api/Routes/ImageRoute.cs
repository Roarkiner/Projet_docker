using Api.Extensions;
using Api.Factory;
using Api.Models;
using Api.ModelsExport;
using Api.ModelsImport;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Api.Routes;

public static class ImageRoute
{
    public static RouteGroupBuilder AjouterRouteImageLike(this RouteGroupBuilder builder)
    {
        builder.WithOpenApi().ProducesServiceUnavailable();

        builder.MapGet("", ListImageLikeDislikeCountUserAsync)
            .Produces<UserLikedImageExport[]>();

        builder.MapGet("currentUser", ListForCurrentUserAsync)
            .Produces<UserLikedImageExport[]>()
            .RequireAuthorization();

        builder.MapPut("like-dislike", AimerPasAimerAsync)
            .ProducesNoContent()
            .RequireAuthorization();

        return builder;
    }

    static async Task<IResult> ListImageLikeDislikeCountUserAsync(
        HttpContext _httpContext,
        [FromServices] IBddConnexion _connexion
    )
    {
        var con = await _connexion.CreerAsync();

        var liste = (await con.QueryAsync<ImageLikeDislikeCountExport>("""
            SELECT 
               UrlImage,
               SUM(CASE WHEN aime = 1 THEN 1 ELSE 0 END) AS LikeCount,
               SUM(CASE WHEN aime = 0 THEN 1 ELSE 0 END) AS DislikeCount
           FROM `UtilisateurAimeImage`
           GROUP BY UrlImage
           """)).ToArray();

        con.Close();

        return Results.Extensions.OK(liste, ImageLikeDislikeCountExportContext.Default);
    }

    static async Task<IResult> ListForCurrentUserAsync(
        HttpContext _httpContext,
        [FromServices] IBddConnexion _connexion
    )
    {
        int id = _httpContext.RecupererId();
        var con = await _connexion.CreerAsync();

        var liste = (await con.QueryAsync<UserLikedImageExportContext>("""
            SELECT i.*, aime
            FROM `UtilisateurAimeImage` uai
            WHERE IdUtilisateur = @id OR IdUtilisateur IS NULL 
           """, new { id })).ToArray();

        con.Close();

        return Results.Extensions.OK(liste, UserLikedImageExportContext.Default);
    }

    static async Task<IResult> AimerPasAimerAsync(
        HttpContext _httpContext,
        [FromServices] IBddConnexion _connexion,
        [FromBody] LikeDislikeImport _likeDislikeImport
    )
    {
        if (_likeDislikeImport.UrlImage.IsNullOrEmpty())
            return Results.NotFound();

        int nb = 0;
        int id = _httpContext.RecupererId();

        var con = await _connexion.CreerAsync();

        var utilisateurImage = await con.QueryFirstOrDefaultAsync<UtilisateurAimeImg>("""
            SELECT * 
            FROM UtilisateurAimeImage 
            WHERE UrlImage = @UrlImage AND IdUtilisateur = @IdUtilisateur
            """, new
        {
            _likeDislikeImport.UrlImage,
            IdUtilisateur = id
        });

        if(utilisateurImage is not null)
        {
            if (_likeDislikeImport.Aime.HasValue)
            {
                nb = await con.ExecuteAsync("""
                    UPDATE UtilisateurAimeImage SET Aime = @Aime 
                    WHERE UrlImage = @UrlImage AND IdUtilisateur = @IdUtilisateur
                """, new
                {
                    _likeDislikeImport.UrlImage,
                    IdUtilisateur = id,
                    _likeDislikeImport.Aime
                });
            }
            else
            {
                nb = await con.ExecuteAsync("""
                    DELETE FROM UtilisateurAimeImage
                    WHERE UrlImage = @UrlImage AND IdUtilisateur = @IdUtilisateur
                """, new
                {
                    _likeDislikeImport.UrlImage,
                    IdUtilisateur = id,
                });
            }
        }
        else
        {
            nb = await con.ExecuteAsync("""
                INSERT INTO UtilisateurAimeImage (Aime, UrlImage, IdUtilisateur) VALUES 
                    (@Aime, @UrlImage, @IdUtilisateur)
                """, new
            {
                _likeDislikeImport.UrlImage,
                IdUtilisateur = id,
                _likeDislikeImport.Aime
            });
        }

        con.Close();

        return nb > 0 ? Results.NoContent() : Results.BadRequest("Erreur");
    }
}
