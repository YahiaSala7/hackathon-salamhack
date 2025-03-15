using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;

namespace SalamHack.Services.Services
{
    public class PriceComparisonService : IPriceComparisonService
    {
        private readonly IPriceComparisonRepository _priceComparisonRepository;
        private readonly IFurnitureRepository _furnitureRepository;
        private readonly IExternalPriceApiClient _externalPriceApiClient;
        private readonly IGeocodingService _geocodingService;
        private readonly IProjectRepository _projectRepository;

        public PriceComparisonService(
            IPriceComparisonRepository priceComparisonRepository,
            IFurnitureRepository furnitureRepository,
            IExternalPriceApiClient externalPriceApiClient,
            IGeocodingService geocodingService,
            IProjectRepository projectRepository)
        {
            _priceComparisonRepository = priceComparisonRepository;
            _furnitureRepository = furnitureRepository;
            _externalPriceApiClient = externalPriceApiClient;
            _geocodingService = geocodingService;
            _projectRepository = projectRepository;
        }

        public async Task<List<PriceComparison>> GetPriceComparisonsByFurnitureIdAsync(int furnitureId)
        {
            return await _priceComparisonRepository.GetByFurnitureIdAsync(furnitureId);
        }

        public async Task<List<PriceComparison>> GetPriceComparisonsForFurnitureAsync(int furnitureId)
        {
            // First, get the furniture details
            var furniture = await _furnitureRepository.GetByIdAsync(furnitureId);
            if (furniture == null)
                throw new ArgumentException("Furniture not found");

            // Get the room and project to determine location
            var room = await _furnitureRepository.GetByIdAsync(furniture.RoomId);
            var project = await _projectRepository.GetByIdAsync(room.ProjectId);

            // Use external price API to get price comparisons
            var priceComparisons = await _externalPriceApiClient.GetPriceComparisonsAsync(furniture.Name, furniture.Category);

            // Save these to the database
            foreach (var comparison in priceComparisons)
            {
                await _priceComparisonRepository.CreateAsync(new PriceComparison
                {
                    FurnitureId = furnitureId,
                    StoreName = comparison.StoreName,
                    Price = comparison.Price,
                    Url = comparison.StoreUrl
                });
            }

            // Also get local store availability
            var nearbyStores = await _externalPriceApiClient.SearchNearbyStoresAsync(
                project.Location, 20, furnitureId);

            foreach (var store in nearbyStores)
            {
                // Calculate distance to store using geocoding service
                double distance = await _geocodingService.CalculateDistanceAsync(
                    project.Location, store.Address);

                // Only include stores within 20km
                if (distance <= 20)
                {
                    await _priceComparisonRepository.CreateAsync(new PriceComparison
                    {
                        FurnitureId = furnitureId,
                        StoreName = store.Name + $" ({distance:F1}km away)",
                        Price = store.Price,
                        Url = store.Url
                    });
                }
            }

            // Return all price comparisons for this furniture
            return await _priceComparisonRepository.GetByFurnitureIdAsync(furnitureId);
        }

        public async Task<PriceComparison> SavePriceComparisonAsync(PriceComparison priceComparison)
        {
            return await _priceComparisonRepository.CreateAsync(priceComparison);
        }

        public async Task<bool> DeletePriceComparisonAsync(int priceComparisonId)
        {
            return await _priceComparisonRepository.DeleteAsync(priceComparisonId);
        }
    }
}
