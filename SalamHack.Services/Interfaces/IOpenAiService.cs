using SalamHack.Data.DTOS.Recommendation;
using SalamHack.Models;

namespace SalamHack.Services.Interfaces
{
    public interface IOpenAIService
    {
        Task<AIRecommendationResponseDto> GetFurnitureRecommendations(Project project, List<Room> rooms = null);
        Task<string> GenerateRoomDescription(Room room);
        Task<string> GenerateReportSummary(Project project);
    }
}
