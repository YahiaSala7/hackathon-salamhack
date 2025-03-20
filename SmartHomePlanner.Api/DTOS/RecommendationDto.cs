using System.Text.Json.Serialization;

namespace SmartHomePlanner.Api.DTOS
{
    public class RecommendationDto
    {
        [JsonPropertyName("roomName")]
        public string RoomName { get; set; }

        [JsonPropertyName("designType")]
        public string DesignType { get; set; }

        [JsonPropertyName("materials")]
        public string Materials { get; set; }

        [JsonPropertyName("reason")]
        public string Reason { get; set; }

        [JsonPropertyName("layout")]
        public string Layout { get; set; }

        [JsonPropertyName("imageUrl")]
        public string ImageUrl { get; set; }
    }
}
