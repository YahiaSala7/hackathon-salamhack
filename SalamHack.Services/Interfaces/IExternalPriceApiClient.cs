using SalamHack.Data.DTOS.Furniture;
using SalamHack.Data.DTOS.PriceComparison;
using SalamHack.Data.DTOS.Store;

namespace SalamHack.Services.interfaces
{
    public interface IExternalPriceApiClient
    {
        Task<List<NearbyStoreDto>> SearchNearbyStoresAsync(string location, int radiusKm, int? furnitureId = null);
        Task<List<FurnitureAvailabilityDto>> SearchFurnitureAvailabilityAsync(int furnitureId, string location, int radiusKm);
        Task<List<PriceComparisonDto>> GetPriceComparisonsAsync(string furnitureName, string category);
    }

}
