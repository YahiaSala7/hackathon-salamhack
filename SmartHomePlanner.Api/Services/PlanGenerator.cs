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
            var result = await _aiService.GenerateCloudflareImageAsync(prompt);

            return new { image = result };
        }

        public async Task<HomeSetupResponseDto> GeneratePlanAsync(PlanRequestDto request)
        {
            // 3. Generate AI recommendations
            var aiInput = JsonSerializer.Serialize(new
            {
                request.Location,
                request.TotalArea,
                request.AreaUnit,
                request.Bathrooms,
                request.Bedrooms,
                request.Currency,
                request.LivingRoom,
                request.OtherRooms,
                request.Occupants,
                request.Kitchen,
                request.Budget,
                request.Style
            });

            var result = await _aiService.GenerateHomeSetupRecommendationsAsync(aiInput);
            var serializedResult = JsonSerializer.Deserialize<HomeSetupResponseDto>(result);
            if (serializedResult != null && serializedResult.Recommendations != null)
            {
                // Access each room's recommendations individually
                if (serializedResult.Recommendations.LivingRooms != null)
                {
                    foreach (var item in serializedResult.Recommendations.LivingRooms)
                    {
                        string prompt = item.Description; // Use the description for the image prompt
                        item.Image = await _aiService.GenerateCloudflareImageAsync(prompt);
                    }
                }

                if (serializedResult.Recommendations.Bedrooms != null)
                {
                    foreach (var item in serializedResult.Recommendations.Bedrooms)
                    {
                        string prompt = item.Description;
                        item.Image = await _aiService.GenerateCloudflareImageAsync(prompt);
                    }
                }

                if (serializedResult.Recommendations.Kitchen != null)
                {
                    foreach (var item in serializedResult.Recommendations.Kitchen)
                    {
                        string prompt = item.Description;
                        item.Image = await _aiService.GenerateCloudflareImageAsync(prompt);
                    }
                }

                if (serializedResult.Recommendations.Bathrooms != null)
                {
                    foreach (var item in serializedResult.Recommendations.Bathrooms)
                    {
                        string prompt = item.Description;
                        item.Image = await _aiService.GenerateCloudflareImageAsync(prompt);
                    }
                }

                if (serializedResult.Recommendations.OtherRooms != null)
                {
                    foreach (var item in serializedResult.Recommendations.OtherRooms)
                    {
                        string prompt = item.Description;
                        item.Image = await _aiService.GenerateCloudflareImageAsync(prompt);
                    }
                }
            }

            return serializedResult;
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
