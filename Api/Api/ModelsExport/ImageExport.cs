using System.Text.Json.Serialization;

namespace Api.ModelsExport;

public record ImageExport
{
    public int Id { get; init; }
    public required string Url { get; init; }
    public bool? Aime { get; init; }
}

[JsonSerializable(typeof(ImageExport[]))]
public partial class ImageExportContext: JsonSerializerContext { }
