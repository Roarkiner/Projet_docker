using Api.Extensions;
using Api.Factory;
using Api.Models;
using Api.ModelsExport;
using Api.ModelsImport;
using Dapper;
using Microsoft.AspNetCore.Mvc;

namespace Api.Routes;

public static class ImageRoute
{
    public static RouteGroupBuilder AjouterRouteImage(this RouteGroupBuilder builder)
    {
        builder.WithOpenApi().ProducesServiceUnavailable();

        builder.MapGet("", ListerAsync)
            .Produces<ImageExport[]>()
            .RequireAuthorization();

        builder.MapPut("like-dislike", AimerPasAimerAsync)
            .ProducesNoContent()
            .RequireAuthorization();

        return builder;
    }

    static async Task<IResult> ListerAsync(
        HttpContext _httpContext,
        [FromServices] IBddConnexion _connexion
    )
    {
        int id = _httpContext.RecupererId();
        var con = await _connexion.CreerAsync();

        var liste = (await con.QueryAsync<ImageExport>("""
            SELECT i.*, aime
            FROM `UtilisateurAimeImage` uai
            RIGHT JOIN Image i on i.Id = uai.IdImage
            WHERE IdUtilisateur = @id OR IdUtilisateur IS NULL 
           """, new { id })).ToArray();

        con.Close();

        return Results.Extensions.OK(liste, ImageExportContext.Default);
    }

    static async Task<IResult> AimerPasAimerAsync(
        HttpContext _httpContext,
        [FromServices] IBddConnexion _connexion,
        [FromBody] LikeDislikeImport _likeDislikeImport
    )
    {
        if (_likeDislikeImport.IdImage <= 0)
            return Results.NotFound();

        int nb = 0;
        int id = _httpContext.RecupererId();

        var con = await _connexion.CreerAsync();

        var utilisateurImage = await con.QueryFirstOrDefaultAsync<UtilisateurAimeImg>("""
            SELECT * 
            FROM UtilisateurAimeImage 
            WHERE IdImage = @IdImage AND IdUtilisateur = @IdUtilisateur
            """, new
        {
            _likeDislikeImport.IdImage,
            IdUtilisateur = id
        });

        if(utilisateurImage is not null)
        {
            if (_likeDislikeImport.Aime.HasValue)
            {
                nb = await con.ExecuteAsync("""
                    UPDATE UtilisateurAimeImage SET Aime = @Aime 
                    WHERE IdImage = @IdImage AND IdUtilisateur = @IdUtilisateur
                """, new
                {
                    _likeDislikeImport.IdImage,
                    IdUtilisateur = id,
                    _likeDislikeImport.Aime
                });
            }
            else
            {
                nb = await con.ExecuteAsync("""
                    DELETE FROM UtilisateurAimeImage
                    WHERE IdImage = @IdImage AND IdUtilisateur = @IdUtilisateur
                """, new
                {
                    _likeDislikeImport.IdImage,
                    IdUtilisateur = id,
                });
            }
        }
        else
        {
            nb = await con.ExecuteAsync("""
                INSERT INTO UtilisateurAimeImage (Aime, IdImage, IdUtilisateur) VALUES 
                    (@Aime, @IdImage, @IdUtilisateur)
                """, new
            {
                _likeDislikeImport.IdImage,
                IdUtilisateur = id,
                _likeDislikeImport.Aime
            });
        }

        con.Close();

        return nb > 0 ? Results.NoContent() : Results.BadRequest("Erreur");
    }
}
