using SalamHack.Data.DTOS.Recommendation;

namespace SalamHack.Services.Interfaces
{

    public interface IAIClient
    {
        Task<AIRecommendationResponseDto> GetRecommendationsAsync(int projectId, int? roomId = null);
        Task<string> GenerateLayoutImageAsync(int projectId, string specialInstructions = null);
        Task<string> GenerateReportAsync(int projectId, string additionalNotes = null);
    }
}
