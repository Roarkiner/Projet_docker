using Api.Extensions;
using Api.Factory;
using Api.Models;
using Api.ModelsImport;
using System.Security.Claims;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Services.Jwts;
using Services.Mdp;
using Api.ModelsExport;

namespace Api.Routes;

public static class AuthRoute
{
    public static RouteGroupBuilder AjouterRouteAuth(this RouteGroupBuilder builder)
    {
        builder.WithOpenApi().ProducesServiceUnavailable();

        builder.MapPost("inscription", InscriptionAsync)
            .ProducesNoContent()
            .ProducesBadRequest();

        builder.MapPost("login", ConnexionAsync)
            .Produces<ConnexionExport>()
            .ProducesBadRequest();

        return builder;
    }

    static async Task<IResult> InscriptionAsync(
        [FromServices] IBddConnexion _connexion,
        [FromServices] IMdpService _mdpServ,
        [FromBody] InscriptionImport _inscriptionImport
    )
    {
        var con = await _connexion.CreerAsync();

        if (string.IsNullOrWhiteSpace(_inscriptionImport.Login) ||
            string.IsNullOrWhiteSpace(_inscriptionImport.Mdp) ||
            string.IsNullOrWhiteSpace(_inscriptionImport.Nom))
        {
            return Results.BadRequest("Tout les champs sont requis et non vide");
        }

        int nbUtilisateur = await con.QueryFirstAsync<int>(
            "SELECT COUNT(*) FROM Utilisateur WHERE Login = @Login", new { _inscriptionImport.Login }
        );

        if (nbUtilisateur > 0)
            return Results.BadRequest("Le login existe déjà");

        string mdpHash = _mdpServ.Hasher(_inscriptionImport.Mdp);

        int nb = await con.ExecuteAsync("""
           INSERT INTO Utilisateur (Login, Mdp, Nom) VALUES (@Login, @Mdp, @Nom)
        """, new
        {
            Mdp = mdpHash,
            Login = _inscriptionImport.Login.XSS(),
            Nom = _inscriptionImport.Nom.XSS()
        });

        return nb > 0 ? Results.NoContent() : Results.BadRequest("Erreur !");
    }

    static async Task<IResult> ConnexionAsync(
        [FromServices] IBddConnexion _connexion,
        [FromServices] IMdpService _mdpServ,
        [FromServices] IJwtService _jwtServ,
        [FromBody] ConnexionImport _connexionImport
    )
    {
        if (string.IsNullOrWhiteSpace(_connexionImport.Login) || string.IsNullOrWhiteSpace(_connexionImport.Mdp))
            return Results.BadRequest("Login ou mdp invalide");

        var con = await _connexion.CreerAsync();

        var utilisateur = await con.QueryFirstOrDefaultAsync<Utilisateur>("" +
            "SELECT * FROM Utilisateur WHERE Login = @Login", new { _connexionImport.Login }
        );

        if (utilisateur is null || !_mdpServ.VerifierHash(_connexionImport.Mdp, utilisateur.Mdp))
            return Results.BadRequest("Login ou mdp invalide");

        string jwt = _jwtServ.Generer([
            new Claim("id", utilisateur.Id.ToString())
        ]);

        return Results.Ok(new ConnexionExport { Jwt = jwt });
    }
}
