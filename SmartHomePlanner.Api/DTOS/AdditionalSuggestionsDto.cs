using System.Text.Json.Serialization;

namespace SmartHomePlanner.Api.DTOS
{
    public class AdditionalSuggestionsDto
    {
        [JsonPropertyName("decisionExplanation")]
        public string DecisionExplanation { get; set; }

        [JsonPropertyName("extraTips")]
        public List<string> ExtraTips { get; set; }
    }
}
