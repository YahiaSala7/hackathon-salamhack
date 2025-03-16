using SalamHack.Data.DTOS.Recommendation;

namespace SalamHack.Services.Interfaces
{

    public interface IAIRecommendationService
    {
        Task<AIRecommendationResponseDto> GetRecommendationsAsync(int projectId, int? roomId = null);
        Task<bool> ApplyRecommendationsAsync(int projectId, AIRecommendationResponseDto recommendations);

    }
}
