using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;

namespace SalamHack.Services.Services
{
    public class FurnitureService : IFurnitureService
    {
        private readonly IFurnitureRepository _furnitureRepository;
        private readonly IPriceComparisonService _priceComparisonService;

        public FurnitureService(
            IFurnitureRepository furnitureRepository,
            IPriceComparisonService priceComparisonService)
        {
            _furnitureRepository = furnitureRepository;
            _priceComparisonService = priceComparisonService;
        }

        public async Task<Furniture> GetFurnitureByIdAsync(int furnitureId)
        {
            return await _furnitureRepository.GetByIdAsync(furnitureId);
        }

        public async Task<List<Furniture>> GetFurnitureByRoomIdAsync(int roomId)
        {
            return await _furnitureRepository.GetByRoomIdAsync(roomId);
        }

        public async Task<Furniture> CreateFurnitureAsync(Furniture furniture)
        {
            var createdFurniture = await _furnitureRepository.CreateAsync(furniture);

            // Automatically fetch price comparisons for this furniture item
            await _priceComparisonService.GetPriceComparisonsForFurnitureAsync(createdFurniture.FurnitureId);

            return createdFurniture;
        }

        public async Task<Furniture> UpdateFurnitureAsync(Furniture furniture)
        {
            return await _furnitureRepository.UpdateAsync(furniture);
        }

        public async Task<bool> DeleteFurnitureAsync(int furnitureId)
        {
            return await _furnitureRepository.DeleteAsync(furnitureId);
        }
    }
}
