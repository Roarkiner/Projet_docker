using System.Text.Json.Serialization;

namespace Api.ModelsExport;

public sealed record ConnexionExport
{
    public required string Jwt { get; init; }
}

[JsonSerializable(typeof(ConnexionExport))]
[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase)]
public partial class ConnexionExportContext: JsonSerializerContext { }