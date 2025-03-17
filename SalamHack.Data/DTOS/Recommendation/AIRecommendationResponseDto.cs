using SalamHack.Data.DTOS.Furniture;
using SalamHack.Data.DTOS.Room;

namespace SalamHack.Data.DTOS.Recommendation
{
    public class AIRecommendationResponseDto
    {
        public List<RoomBudgetRecommendationDto> RoomBudgetRecommendations { get; set; } = new List<RoomBudgetRecommendationDto>();
        public List<FurnitureRecommendationDto> FurnitureRecommendations { get; set; } = new List<FurnitureRecommendationDto>();
        public List<RoomRecommendationDto> RoomRecommendations { get; set; } = new List<RoomRecommendationDto>();
        public decimal TotalBudgetUsed { get; set; }
        public string GeneralRecommendation { get; set; }
    }

    public class RoomBudgetRecommendationDto
    {
        public int RoomId { get; set; }
        public decimal RecommendedBudget { get; set; }
        public string? RecommendationReason { get; set; }
        public List<FurnitureDto> RecommendedFurniture { get; set; } = new List<FurnitureDto>();
    }

    public class FurnitureRecommendationDto
    {
        public int? RoomId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal EstimatedPrice { get; set; }
        public string PreferredStore { get; set; } = string.Empty;
        public string? RecommendationReason { get; set; }
        public bool IsApproved { get; set; } = false;
        public string MapUrl { get; set; }
    }
}



