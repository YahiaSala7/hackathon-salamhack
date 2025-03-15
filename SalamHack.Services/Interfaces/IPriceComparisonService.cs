using SalamHack.Data.DTOS.PriceComparison;

namespace SalamHack.Services.interfaces
{

    public interface IPriceComparisonService
    {
        Task<PriceComparisonDto> GetPriceComparisonByIdAsync(int comparisonId);
        Task<List<PriceComparisonDto>> GetFurniturePriceComparisonsAsync(int furnitureId);
        Task<PriceComparisonDto> CreatePriceComparisonAsync(PriceComparisonCreateDto priceComparisonCreateDto);
        Task<PriceComparisonDto> UpdatePriceComparisonAsync(int comparisonId, PriceComparisonCreateDto priceComparisonUpdateDto);
        Task<bool> DeletePriceComparisonAsync(int comparisonId);
    }
}
