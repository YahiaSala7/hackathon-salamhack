namespace SalamHack.Data.DTOS.Furniture
{
    public class FurnitureAvailabilityDto : FurnitureDto
    {
        public string FurnitureName { get; set; }
        public string Category { get; set; }
        public decimal Price { get; set; }
        public string ProductUrl { get; set; }

        // Add missing properties:
        public double Distance { get; set; }
        public string MapUrl { get; set; }
        public string StoreAddress { get; set; }
        public string StoreName { get; set; }
    }
}

