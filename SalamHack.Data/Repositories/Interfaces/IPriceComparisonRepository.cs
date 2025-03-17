using SalamHack.Models;

namespace SalamHack.Data.Repositories.Interfaces
{
    public interface IPriceComparisonRepository
    {
        Task<PriceComparison> GetByIdAsync(int comparisonId);
        Task<List<PriceComparison>> GetByFurnitureIdAsync(int furnitureId);
        Task<PriceComparison> GetByFurnitureIdAndStoreAsync(int furnitureId, string storeName);
        Task<PriceComparison> CreateAsync(PriceComparison priceComparison);
        Task<PriceComparison> UpdateAsync(PriceComparison priceComparison);
        Task<bool> DeleteAsync(int comparisonId);
    }
}
