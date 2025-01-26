using System.Text.Json.Serialization;

namespace Api.ModelsExport;

public record UserLikedImageExport
{
    public int Id { get; init; }
    public required string UrlImage { get; init; }
    public bool? Aime { get; init; }
}

[JsonSerializable(typeof(UserLikedImageExport[]))]
public partial class UserLikedImageExportContext : JsonSerializerContext { }
