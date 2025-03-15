using SalamHack.Data.DTOS.PriceComparison;

namespace SalamHack.Data.DTOS.Furniture
{
    // DTO للأثاث
    public class FurnitureDto
    {
        public int FurnitureId { get; set; }
        public int RoomId { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }
        public string StoreLink { get; set; }
        public List<PriceComparisonDto> PriceComparisons { get; set; }
    }
}

