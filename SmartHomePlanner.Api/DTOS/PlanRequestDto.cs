using System.Text.Json.Serialization;

namespace SmartHomePlanner.Api.DTOS
{
    // DTOs/PlanRequestDto.cs
    public class PlanRequestDto
    {
        [JsonPropertyName("location")]
        public string Location { get; set; }

        [JsonPropertyName("area")]
        public double TotalArea { get; set; }

        [JsonPropertyName("areaUnit")]
        public string AreaUnit { get; set; }

        [JsonPropertyName("bathrooms")]
        public int Bathrooms { get; set; }

        [JsonPropertyName("bedrooms")]
        public int Bedrooms { get; set; }

        [JsonPropertyName("currency")]
        public string Currency { get; set; } // e.g., "USD", "KWD"

        [JsonPropertyName("budget")]
        public double Budget { get; set; }

        [JsonPropertyName("livingRoom")]
        public int LivingRoom { get; set; }

        [JsonPropertyName("otherRooms")]
        public string OtherRooms { get; set; } // Description of other rooms

        [JsonPropertyName("occupants")]
        public string Occupants { get; set; } // Description of occupants

        [JsonPropertyName("kitchen")]
        public int Kitchen { get; set; } // Description of kitchen

        [JsonPropertyName("style")]
        public string Style { get; set; } // Preferred style
    }
}
