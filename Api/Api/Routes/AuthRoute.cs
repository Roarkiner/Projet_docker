using System.Security.Claims;
using Api.Extensions;
using Api.Factory;
using Api.Models;
using Api.ModelsExport;
using Api.ModelsImport;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Services.Jwts;
using Services.Mdp;

namespace Api.Routes;

public static class AuthRoute
{
    public static RouteGroupBuilder AjouterRouteAuth(this RouteGroupBuilder builder)
    {
        builder.WithOpenApi().ProducesServiceUnavailable();

        builder.MapPost("inscription", InscriptionAsync)
            .Produces<ConnexionExport>()
            .ProducesBadRequest();

        builder.MapPost("login", ConnexionAsync)
            .Produces<ConnexionExport>()
            .ProducesBadRequest();

        return builder;
    }

    static async Task<IResult> InscriptionAsync(
        [FromServices] IBddConnexion _connexion,
        [FromServices] IMdpService _mdpServ,
        [FromServices] IJwtService _jwtServ,
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
        string login = _inscriptionImport.Login.XSS();
        string name = _inscriptionImport.Nom.XSS();

        int idUser = await con.QuerySingleAsync<int>(
            @"
            INSERT INTO Utilisateur (Login, Mdp, Nom) 
            VALUES (@Login, @Mdp, @Nom);
            SELECT LAST_INSERT_ID();",
            new
            {
                Login = _inscriptionImport.Login.XSS(),
                Mdp = mdpHash,
                Nom = _inscriptionImport.Nom.XSS()
            });

        con.Close();

        ConnexionUser user = new ConnexionUser() { Id = idUser, Login = login, Nom = name };

        string jwt = _jwtServ.Generer([
            new Claim("id", idUser.ToString())
        ]);

        return idUser > 0 ? Results.Extensions.OK(new ConnexionExport { User = user, Jwt = jwt }, ConnexionExportContext.Default) : Results.BadRequest("Erreur !");
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

        var user = await con.QueryFirstOrDefaultAsync<Utilisateur>("" +
            "SELECT * FROM Utilisateur WHERE Login = @Login", new { _connexionImport.Login }
        );

        if (user is null || !_mdpServ.VerifierHash(_connexionImport.Mdp, user.Mdp))
            return Results.BadRequest("Login ou mdp invalide");

        string jwt = _jwtServ.Generer([
            new Claim("id", user.Id.ToString())
        ]);

        con.Close();

        ConnexionUser conUser = new ConnexionUser() { Id = user.Id, Login = user.Login, Nom = user.Nom };

        return Results.Extensions.OK(new ConnexionExport { User = conUser, Jwt = jwt }, ConnexionExportContext.Default);
    }
}
