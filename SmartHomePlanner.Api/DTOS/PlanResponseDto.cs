using System.Text.Json.Serialization;

namespace SmartHomePlanner.Api.DTOS
{
    // DTOs/PlanResponseDto.cs
    public class PlanResponseDto
    {
        [JsonPropertyName("resourceDistribution")]
        public List<ResourceAllocationDto> ResourceDistribution { get; set; }

        [JsonPropertyName("recommendations")]
        public List<RecommendationDto> Recommendations { get; set; }

        [JsonPropertyName("additionalSuggestions")]
        public AdditionalSuggestionsDto AdditionalSuggestions { get; set; }
    }
}
