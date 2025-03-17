namespace SalamHack.Data.DTOS.PriceComparison
{
    // DTO لمقارنة الأسعار
    public class PriceComparisonDto
    {
        public int ComparisonId { get; set; }
        public int FurnitureId { get; set; }
        public string StoreName { get; set; }
        public decimal Price { get; set; }
        public string MapUrl { get; set; }
        // For AI recommendations:
        public bool IsRecommended { get; set; }
        public string RecommendationReason { get; set; }
        public DateTime CreatedAt { get; set; }
        //public string RecommendationReason { get; set; }
        //public bool IsRecommended { get; set; }
    }
}


