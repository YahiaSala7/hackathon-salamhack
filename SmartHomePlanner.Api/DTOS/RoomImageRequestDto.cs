using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SmartHomePlanner.Api.DTOS
{
    public class RoomImageRequestDto
    {
        [JsonPropertyName("roomType")]
        public string RoomType { get; set; }

        [JsonPropertyName("recommendations")]
        public List<RecommendationItemDto> Recommendations { get; set; }
    }
}