using System.Text.Json.Serialization;

namespace SmartHomePlanner.Api.DTOS
{
    // DTOs/PlanRequestDto.cs
    public class PlanRequestDto
    {
        [JsonPropertyName("location")]
        public string Location { get; set; }

        [JsonPropertyName("totalArea")]
        public double TotalArea { get; set; }

        [JsonPropertyName("rooms")]
        public List<RoomDto> Rooms { get; set; }

        [JsonPropertyName("budget")]
        public double Budget { get; set; }

        [JsonPropertyName("preferredStyle")]
        public string PreferredStyle { get; set; }
    }
}
