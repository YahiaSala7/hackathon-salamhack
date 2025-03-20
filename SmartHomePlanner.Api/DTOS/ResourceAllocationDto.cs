using System.Text.Json.Serialization;

namespace SmartHomePlanner.Api.DTOS
{
    public class ResourceAllocationDto
    {
        [JsonPropertyName("roomName")]
        public string roomName { get; set; }

        [JsonPropertyName("percentage")]
        public double Percentage { get; set; }
        
        [JsonPropertyName("reason")]
        public string reason { get; set; }

        [JsonPropertyName("budget")]
        public string budget { get; set; }

    }
}
