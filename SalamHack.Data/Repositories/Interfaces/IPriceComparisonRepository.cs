using SalamHack.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalamHack.Data.Repositories.Interfaces
{
    public interface IPriceComparisonRepository
    {
        Task<PriceComparison> GetByIdAsync(int comparisonId);
        Task<List<PriceComparison>> GetByFurnitureIdAsync(int furnitureId);
        Task<PriceComparison> CreateAsync(PriceComparison priceComparison);
        Task<PriceComparison> UpdateAsync(PriceComparison priceComparison);
        Task<bool> DeleteAsync(int comparisonId);
    }
}
