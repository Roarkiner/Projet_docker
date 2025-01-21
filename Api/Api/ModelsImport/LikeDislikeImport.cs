namespace Api.ModelsImport;

public sealed record LikeDislikeImport
{
    public required int IdImage { get; init; }
    public required bool Aime { get; init; }
}
