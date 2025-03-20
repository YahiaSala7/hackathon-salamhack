using SmartHomePlanner.Api.DTOS;

namespace SmartHomePlanner.Api.Services.Interfaces
{
    // Interfaces/IAiService.cs
    public interface IAiService
    {
        Task<string> GenerateAllocationExplanationAsync(string input);
        Task<string> GenerateHomeSetupRecommendationsAsync(string input);
        Task<string> GenerateRoomImageAsync(string prompt);
        Task<string> GenerateStabilityImage(string prompt);
        Task<string> GenerateCloudflareImageAsync(string prompt);
    }
}
