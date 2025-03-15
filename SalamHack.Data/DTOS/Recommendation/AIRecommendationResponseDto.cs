using SalamHack.Data.DTOS.Room;

namespace SalamHack.Data.DTOS.Recommendation
{
    public class AIRecommendationResponseDto
    {
        public List<RoomRecommendationDto> RoomRecommendations { get; set; } = new List<RoomRecommendationDto>();
        public decimal TotalBudgetUsed { get; set; }
        public string GeneralRecommendation { get; set; }
    }
}


