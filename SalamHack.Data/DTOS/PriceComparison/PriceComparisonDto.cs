namespace SalamHack.Data.DTOS.PriceComparison
{
    // DTO لمقارنة الأسعار
    public class PriceComparisonDto
    {
        public int ComparisonId { get; set; }
        public int FurnitureId { get; set; }
        public string StoreName { get; set; }
        public decimal Price { get; set; }
        public string Url { get; set; }
    }
}


