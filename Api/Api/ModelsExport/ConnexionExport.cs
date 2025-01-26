using System.Text.Json.Serialization;
using Api.Models;

namespace Api.ModelsExport;

public class ConnexionUser
{
    public int Id { get; set; }
    public required string Login { get; set; }
    public required string Nom { get; set; }
}

public sealed record ConnexionExport
{
    public required string Jwt { get; init; }

    public required ConnexionUser User { get; init; }
}

[JsonSerializable(typeof(ConnexionExport))]
[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase)]
public partial class ConnexionExportContext: JsonSerializerContext { }