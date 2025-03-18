using SalamHack.Data.DTOS.Recommendation;

namespace SalamHack.Data.DTOS.Room
{
    public class RoomRecommendationDto
    {
        public string RoomType { get; set; }
        public decimal RecommendedBudget { get; set; }
        public List<FurnitureRecommendationDto> RecommendedFurniture { get; set; } = new List<FurnitureRecommendationDto>();
    }
}


