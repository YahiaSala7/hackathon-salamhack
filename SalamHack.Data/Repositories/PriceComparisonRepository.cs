using Microsoft.EntityFrameworkCore;
using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;

namespace SalamHack.Data.Repositories
{
    public class PriceComparisonRepository : IPriceComparisonRepository
    {
        private readonly ApplicationDbContext _context;

        public PriceComparisonRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<PriceComparison> GetByIdAsync(int comparisonId)
        {
            return await _context.PriceComparisons.FindAsync(comparisonId);
        }
        public async Task<PriceComparison> GetByFurnitureIdAndStoreAsync(int furnitureId, string storeName)
        {
            return await _context.PriceComparisons
                .FirstOrDefaultAsync(pc => pc.FurnitureId == furnitureId && pc.StoreName == storeName);
        }
        public async Task<List<PriceComparison>> GetByFurnitureIdAsync(int furnitureId)
        {
            return await _context.PriceComparisons
                .Where(pc => pc.FurnitureId == furnitureId)
                .ToListAsync();
        }

        public async Task<PriceComparison> CreateAsync(PriceComparison priceComparison)
        {

            _context.PriceComparisons.Add(priceComparison);
            await _context.SaveChangesAsync();

            return priceComparison;
        }

        public async Task<PriceComparison> UpdateAsync(PriceComparison priceComparison)
        {
            _context.PriceComparisons.Update(priceComparison);
            await _context.SaveChangesAsync();

            return priceComparison;
        }

        public async Task<bool> DeleteAsync(int comparisonId)
        {
            var priceComparison = await _context.PriceComparisons.FindAsync(comparisonId);
            if (priceComparison == null)
                return false;

            _context.PriceComparisons.Remove(priceComparison);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}



