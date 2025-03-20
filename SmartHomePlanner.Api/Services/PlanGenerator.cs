using SmartHomePlanner.Api.DTOS;
using SmartHomePlanner.Api.Services.Interfaces;
using System.Text.Json;

namespace SmartHomePlanner.Api.Services
{
    // Services/PlanGenerator.cs
    public class PlanGenerator : IPlanGenerator
    {
        private readonly IAiService _aiService;
        //private readonly IClimateService _climateService;

        public PlanGenerator(IAiService aiService)
        {
            _aiService = aiService;
            //_climateService = climateService;
        }

        public async Task<object> GenerateImageAsync(string prompt)
        {
            var result = await _aiService.GenerateStabilityImage(prompt);

            return new { image = result };
        }

        public async Task<HomeSetupResponseDto> GeneratePlanAsync(PlanRequestDto request)
        {
            // 1. Calculate room areas
            var roomAreas = request.Rooms.Select(r => new
            {
                Name = r.RoomName,
                Area = r.Height * r.Width * r.Quantity
            }).ToList();

            // 2. Get climate data
            //var climateDescription = await _climateService.GetClimateDescriptionAsync(request.Location);

            // 3. Generate AI recommendations
            var aiInput = JsonSerializer.Serialize(new
            {
                request.Location,
                request.PreferredStyle,
                //Climate = climateDescription,
                Rooms = roomAreas
            });

            var result = await _aiService.GenerateHomeSetupRecommendationsAsync(aiInput);

            //var allocationExplanation = await _aiService.GenerateAllocationExplanationAsync(aiInput);
            //var homeSetupRecommendations = await _aiService.GenerateHomeSetupRecommendationsAsync(aiInput);

            // 4. Process AI responses
            //var resourceDistribution = ProcessAllocation(allocationExplanation);
            // var recommendations = ProcessRecommendations(designRecommendations);

            // 5. Generate additional suggestions
            //var additionalSuggestions = new AdditionalSuggestionsDto
            //{
            //    DecisionExplanation = allocationExplanation,
            //    ExtraTips = new List<string> { "استخدم أرفف معلقة لتوفير المساحة" }
            //};

            return JsonSerializer.Deserialize<HomeSetupResponseDto>(result);

        }

        private List<ResourceAllocationDto> ProcessAllocation(string aiResponse)
        {
            // Parse AI response into structured data
            return JsonSerializer.Deserialize<List<ResourceAllocationDto>>(aiResponse);
        }

        private List<RecommendationDto> ProcessRecommendations(string aiResponse)
        {
            // Parse AI response into structured data
            return JsonSerializer.Deserialize<List<RecommendationDto>>(aiResponse);
        }
    }
}
