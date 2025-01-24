using MySqlConnector;
using System.Data;

namespace Api.Factory;

public class BddConnexionFactory: IBddConnexion
{
    private readonly string connexion;

    public BddConnexionFactory(string _connexion)
    {
        connexion = _connexion;
    }

    public async Task<IDbConnection> CreerAsync()
    {
        var con = new MySqlConnection(connexion);
        await con.OpenAsync();

        return con;
    }
}

public interface IBddConnexion
{
    public Task<IDbConnection> CreerAsync();
}