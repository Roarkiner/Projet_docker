using System.Text.Json.Serialization;

namespace Api.ModelsExport;

public record ImageLikeDislikeCountExport
{
    public required string UrlImage { get; init; }
    public int? LikeCount { get; init; }
    public int? DislikeCount { get; init; }
}

[JsonSerializable(typeof(ImageLikeDislikeCountExport[]))]
public partial class ImageLikeDislikeCountExportContext : JsonSerializerContext { }
