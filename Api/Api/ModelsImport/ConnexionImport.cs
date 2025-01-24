namespace Api.ModelsImport;

public sealed record ConnexionImport
{
    public required string Login { get; init; }
    public required string Mdp { get; init; }
}
