namespace Api.Models;

public class Utilisateur
{
    public int Id { get; set; }
    public required string Login { get; set; }
    public required string Mdp { get; set; }
    public required string Nom { get; set; }
}
