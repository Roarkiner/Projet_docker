using System.Text.Json.Serialization;

namespace Api.Models;

public class Image
{
    public int Id { get; set; }
    public required string Url { get; set; }
}

[JsonSerializable(typeof(Image[]))]
public partial class ImageContext: JsonSerializerContext { }
