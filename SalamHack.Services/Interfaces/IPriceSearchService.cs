using SalamHack.Data.DTOS.Furniture;
using SalamHack.Data.DTOS.PriceComparison;
using SalamHack.Data.DTOS.Store;

namespace SalamHack.Services.Interfaces
{

    public interface IPriceSearchService
    {
        Task<List<NearbyStoreDto>> FindNearbyStoresAsync(int projectId, int radiusKm = 20);
        Task<List<FurnitureAvailabilityDto>> FindFurnitureAvailabilityAsync(int furnitureId, int projectId, int radiusKm = 20);
        Task<List<PriceComparisonDto>> SearchPriceComparisonsAsync(string furnitureName, string category);
    }
    public class PriceApiSettings
    {
        public string BaseUrl { get; set; }
        public string ApiKey { get; set; }
    }
}
