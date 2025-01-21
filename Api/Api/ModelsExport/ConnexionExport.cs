using System.Text.Json.Serialization;

namespace Api.ModelsExport;

public sealed record ConnexionExport
{
    [JsonPropertyName("jwt")]
    public required string Jwt { get; init; }
}

[JsonSerializable(typeof(ConnexionExport))]
public partial class ConnexionExportContext: JsonSerializerContext { }
