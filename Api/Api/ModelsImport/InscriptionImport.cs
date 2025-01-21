namespace Api.ModelsImport;

public record InscriptionImport
{
    public required string Login { get; init; }
    public required string Nom { get; init; }
    public required string Mdp { get; init; }
}
