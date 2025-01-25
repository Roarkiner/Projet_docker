namespace Api.ModelsImport;

public sealed record LikeDislikeImport
{
    public required string UrlImage { get; init; }
    public required bool? Aime { get; init; }
}
