using System.Text.Json.Serialization;

namespace SmartHomePlanner.Api.DTOS
{
    // DTOs/RoomDto.cs
    public class RoomDto
    {
        [JsonPropertyName("roomName")]
        public string RoomName { get; set; }

        [JsonPropertyName("quantity")]
        public int Quantity { get; set; }

        [JsonPropertyName("height")]
        public double Height { get; set; }

        [JsonPropertyName("width")]
        public double Width { get; set; }
    }
}