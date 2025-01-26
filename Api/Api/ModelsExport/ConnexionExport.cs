using System.Text.Json.Serialization;
using Api.Models;

namespace Api.ModelsExport;

public sealed record ConnexionExport
{
    public required string Jwt { get; init; }

    public required Utilisateur User { get; init; }
}

[JsonSerializable(typeof(ConnexionExport))]
[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase)]
public partial class ConnexionExportContext: JsonSerializerContext { }