using SalamHack.Data.DTOS.Furniture;

namespace SalamHack.Data.DTOS.Store
{
    // DTOs للمتاجر القريبة
    public class NearbyStoreDto
    {
        public string StoreName { get; set; }
        public string Address { get; set; }
        public double DistanceKm { get; set; }
        public string MapUrl { get; set; }
        public List<FurnitureAvailabilityDto> AvailableFurniture { get; set; } = new List<FurnitureAvailabilityDto>();
    }
}


