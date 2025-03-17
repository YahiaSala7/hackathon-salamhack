using AutoMapper;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using SalamHack.Data.DTOS.Furniture;
using SalamHack.Data.DTOS.PriceComparison;
using SalamHack.Data.DTOS.Recommendation;
using SalamHack.Data.DTOS.Store;
using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;
using SalamHack.Services.Interfaces;

namespace SalamHack.Services.Services
{
    public class EnhancedPriceService : IPriceComparisonService, IPriceSearchService
    {
        private readonly IPriceComparisonRepository _priceComparisonRepository;
        private readonly IFurnitureRepository _furnitureRepository;
        private readonly IExternalPriceApiClient _externalPriceApiClient;
        private readonly IGeocodingService _geocodingService;
        private readonly IProjectRepository _projectRepository;
        private readonly IAIClient _aiClient;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;
        private readonly ILogger<EnhancedPriceService> _logger;

        public EnhancedPriceService(
            IPriceComparisonRepository priceComparisonRepository,
            IFurnitureRepository furnitureRepository,
            IExternalPriceApiClient externalPriceApiClient,
            IGeocodingService geocodingService,
            IProjectRepository projectRepository,
            IAIClient aiClient,
            IMapper mapper,
            IMemoryCache cache,
            ILogger<EnhancedPriceService> logger)
        {
            _priceComparisonRepository = priceComparisonRepository;
            _furnitureRepository = furnitureRepository;
            _externalPriceApiClient = externalPriceApiClient;
            _geocodingService = geocodingService;
            _projectRepository = projectRepository;
            _aiClient = aiClient;
            _mapper = mapper;
            _cache = cache;
            _logger = logger;
        }

        // Implementation of IPriceComparisonService methods
        public async Task<PriceComparisonDto> GetPriceComparisonByIdAsync(int comparisonId)
        {
            var comparison = await _priceComparisonRepository.GetByIdAsync(comparisonId);
            return _mapper.Map<PriceComparisonDto>(comparison);
        }

        public async Task<List<PriceComparisonDto>> GetFurniturePriceComparisonsAsync(int furnitureId)
        {
            var comparisons = await _priceComparisonRepository.GetByFurnitureIdAsync(furnitureId);
            return _mapper.Map<List<PriceComparisonDto>>(comparisons);
        }

        public async Task<List<PriceComparisonDto>> GetPriceComparisonsForFurnitureAsync(int furnitureId)
        {
            var furniture = await _furnitureRepository.GetByIdAsync(furnitureId);
            if (furniture == null)
                throw new ArgumentException("Furniture not found");

            var existingComparisons = await _priceComparisonRepository.GetByFurnitureIdAsync(furnitureId);
            var recentComparisons = existingComparisons
                .Where(c => c.CreatedAt > DateTime.Now.AddHours(-24))
                .ToList();

            if (recentComparisons.Any())
                return _mapper.Map<List<PriceComparisonDto>>(recentComparisons);

            var room = await _furnitureRepository.GetRoomByFurnitureIdAsync(furnitureId);
            if (room == null)
                throw new ArgumentException("Room not found for the furniture");

            var project = await _projectRepository.GetByIdAsync(room.ProjectId);
            if (project == null)
                throw new ArgumentException("Project not found for the room");

            var priceData = await GetPriceDataAsync(furniture, project);
            var onlinePrices = priceData.OnlinePrices;
            var nearbyStores = priceData.NearbyStores;

            var newComparisons = await ProcessAndStoreComparisons(
                furnitureId,
                onlinePrices,
                nearbyStores,
                project.Location);

            return _mapper.Map<List<PriceComparisonDto>>(newComparisons);
        }

        public async Task<PriceComparisonDto> CreatePriceComparisonAsync(PriceComparisonCreateDto priceComparisonCreateDto)
        {
            var entity = _mapper.Map<PriceComparison>(priceComparisonCreateDto);
            var createdEntity = await _priceComparisonRepository.CreateAsync(entity);
            return _mapper.Map<PriceComparisonDto>(createdEntity);
        }

        public async Task<PriceComparisonDto> UpdatePriceComparisonAsync(int comparisonId, PriceComparisonCreateDto priceComparisonUpdateDto)
        {
            var existingComparison = await _priceComparisonRepository.GetByIdAsync(comparisonId);
            if (existingComparison == null)
                throw new ArgumentException("Price comparison not found");

            _mapper.Map(priceComparisonUpdateDto, existingComparison);
            var updatedComparison = await _priceComparisonRepository.UpdateAsync(existingComparison);
            return _mapper.Map<PriceComparisonDto>(updatedComparison);
        }

        public async Task<bool> DeletePriceComparisonAsync(int priceComparisonId)
        {
            return await _priceComparisonRepository.DeleteAsync(priceComparisonId);
        }

        // Implementation of IPriceSearchService methods
        public async Task<List<NearbyStoreDto>> FindNearbyStoresAsync(int projectId, int radiusKm = 20)
        {
            string cacheKey = $"nearbystores_{projectId}_{radiusKm}";
            if (_cache.TryGetValue(cacheKey, out List<NearbyStoreDto> cachedStores))
                return cachedStores;

            var project = await _projectRepository.GetByIdAsync(projectId)
                ?? throw new ArgumentException("Project not found");

            try
            {
                var stores = await _externalPriceApiClient.SearchNearbyStoresAsync(project.Location, radiusKm);
                var validatedStores = await ValidateStoreDistancesAsync(stores, project.Location, radiusKm);

                _cache.Set(cacheKey, validatedStores, TimeSpan.FromHours(1));
                return validatedStores;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error finding nearby stores for project {projectId}");
                throw;
            }
        }

        public async Task<List<FurnitureAvailabilityDto>> FindFurnitureAvailabilityAsync(int furnitureId, int projectId, int radiusKm = 20)
        {
            string cacheKey = $"furniture_availability_{furnitureId}_{projectId}_{radiusKm}";
            if (_cache.TryGetValue(cacheKey, out List<FurnitureAvailabilityDto> cachedAvailability))
                return cachedAvailability;

            var project = await _projectRepository.GetByIdAsync(projectId)
                ?? throw new ArgumentException("Project not found");

            try
            {
                var availabilityList = await _externalPriceApiClient.SearchFurnitureAvailabilityAsync(
                    furnitureId, project.Location, radiusKm);

                var validatedAvailability = await ProcessAvailabilityData(
                    availabilityList,
                    furnitureId,
                    project.Location);

                _cache.Set(cacheKey, validatedAvailability, TimeSpan.FromMinutes(30));
                return validatedAvailability;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error finding furniture availability for furniture {furnitureId}");
                throw;
            }
        }

        public async Task<List<PriceComparisonDto>> SearchPriceComparisonsAsync(string furnitureName, string category)
        {
            string cacheKey = $"price_comparisons_{furnitureName}_{category}";
            if (_cache.TryGetValue(cacheKey, out List<PriceComparisonDto> cachedComparisons))
                return cachedComparisons;

            try
            {
                var comparisons = await _externalPriceApiClient.GetPriceComparisonsAsync(furnitureName, category);
                _cache.Set(cacheKey, comparisons, TimeSpan.FromHours(4));
                return comparisons;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error searching price comparisons for {furnitureName}");
                throw;
            }
        }

        public async Task<List<PriceComparisonDto>> GetAIEnhancedPriceComparisonsAsync(int furnitureId, int projectId)
        {
            try
            {
                var furniture = await _furnitureRepository.GetByIdAsync(furnitureId)
                    ?? throw new ArgumentException("Furniture not found");

                var onlineComparisons = await SearchPriceComparisonsAsync(furniture.Name, furniture.Category);
                var localAvailability = await FindFurnitureAvailabilityAsync(furnitureId, projectId);

                var allComparisons = CombineComparisons(onlineComparisons, localAvailability);
                return await ApplyAIRecommendations(allComparisons, projectId, furniture.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting AI-enhanced comparisons for furniture {furnitureId}");
                throw;
            }
        }

        // Private helper methods
        private async Task<(List<PriceComparisonDto> OnlinePrices, List<NearbyStoreDto> NearbyStores)>
            GetPriceDataAsync(Furniture furniture, Project project)
        {
            var onlinePricesTask = _externalPriceApiClient.GetPriceComparisonsAsync(furniture.Name, furniture.Category);
            var nearbyStoresTask = _externalPriceApiClient.SearchNearbyStoresAsync(project.Location, 20, furniture.FurnitureId);

            await Task.WhenAll(onlinePricesTask, nearbyStoresTask);
            return (await onlinePricesTask, await nearbyStoresTask);
        }

        private async Task<List<PriceComparison>> ProcessAndStoreComparisons(
            int furnitureId,
            List<PriceComparisonDto> onlinePrices,
            List<NearbyStoreDto> nearbyStores,
            string projectLocation)
        {
            var newComparisons = new List<PriceComparison>();

            // Process online prices
            newComparisons.AddRange(await ProcessOnlinePrices(furnitureId, onlinePrices));

            // Process nearby stores
            newComparisons.AddRange(await ProcessNearbyStores(furnitureId, nearbyStores, projectLocation));

            return newComparisons;
        }

        private async Task<List<PriceComparison>> ProcessOnlinePrices(int furnitureId, List<PriceComparisonDto> onlinePrices)
        {
            var comparisons = new List<PriceComparison>();
            foreach (var comparison in onlinePrices)
            {
                var newComparison = new PriceComparison
                {
                    FurnitureId = furnitureId,
                    StoreName = comparison.StoreName,
                    Price = comparison.Price,
                    Url = comparison.MapUrl,
                    CreatedAt = DateTime.Now
                };
                comparisons.Add(newComparison);
                await _priceComparisonRepository.CreateAsync(newComparison);
            }
            return comparisons;
        }

        private async Task<List<PriceComparison>> ProcessNearbyStores(
            int furnitureId,
            List<NearbyStoreDto> nearbyStores,
            string projectLocation)
        {
            var comparisons = new List<PriceComparison>();
            var storesWithDistance = await ValidateStoreDistancesAsync(nearbyStores, projectLocation, 20);

            foreach (var store in storesWithDistance)
            {
                var newComparison = new PriceComparison
                {
                    FurnitureId = furnitureId,
                    StoreName = $"{store.StoreName} ({store.DistanceKm:F1}km away)",
                    // Price = store.Price,
                    Url = store.MapUrl,
                    CreatedAt = DateTime.Now
                };
                comparisons.Add(newComparison);
                await _priceComparisonRepository.CreateAsync(newComparison);
            }
            return comparisons;
        }

        private async Task<List<NearbyStoreDto>> ValidateStoreDistancesAsync(
            List<NearbyStoreDto> stores,
            string projectLocation,
            int maxDistance)
        {
            var validatedStores = new List<NearbyStoreDto>();

            foreach (var store in stores)
            {
                try
                {
                    double distance = await _geocodingService.CalculateDistanceAsync(
                        projectLocation,
                        store.Address);

                    if (distance <= maxDistance)
                    {
                        store.DistanceKm = Math.Round(distance, 1);
                        validatedStores.Add(store);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, $"Error calculating distance for store {store.StoreName}");
                }
            }
            return validatedStores;
        }

        private async Task<List<FurnitureAvailabilityDto>> ProcessAvailabilityData(
            List<FurnitureAvailabilityDto> availabilityList,
            int furnitureId,
            string projectLocation)
        {
            var processedList = new List<FurnitureAvailabilityDto>();

            foreach (var item in availabilityList)
            {
                try
                {
                    item.Distance = Math.Round(
                        await _geocodingService.CalculateDistanceAsync(projectLocation, item.StoreAddress),
                        1);

                    if (item.Distance <= 20)
                    {
                        processedList.Add(item);
                        await UpdatePriceComparison(furnitureId, item);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, $"Error processing availability for {item.StoreName}");
                }
            }
            return processedList;
        }

        private async Task UpdatePriceComparison(int furnitureId, FurnitureAvailabilityDto item)
        {
            try
            {
                var existing = await _priceComparisonRepository.GetByFurnitureIdAndStoreAsync(
                    furnitureId,
                    item.StoreName);

                if (existing == null)
                {
                    await _priceComparisonRepository.CreateAsync(new PriceComparison
                    {
                        FurnitureId = furnitureId,
                        StoreName = $"{item.StoreName} ({item.Distance}km away)",
                        Price = item.Price,
                        Url = item.MapUrl,
                        CreatedAt = DateTime.Now
                    });
                }
                else if (existing.Price != item.Price)
                {
                    existing.Price = item.Price;
                    existing.CreatedAt = DateTime.Now;
                    await _priceComparisonRepository.UpdateAsync(existing);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, $"Error updating price comparison for store {item.StoreName}");
            }
        }

        private List<PriceComparisonDto> CombineComparisons(
            List<PriceComparisonDto> onlineComparisons,
            List<FurnitureAvailabilityDto> localAvailability)
        {
            return onlineComparisons.Concat(localAvailability.Select(a => new PriceComparisonDto
            {
                StoreName = $"{a.StoreName} ({a.Distance}km away)",
                Price = a.Price,
                MapUrl = a.MapUrl
            })).ToList();
        }

        private async Task<List<PriceComparisonDto>> ApplyAIRecommendations(
            List<PriceComparisonDto> comparisons,
            int projectId,
            string furnitureName)
        {
            try
            {
                var aiRecommendation = await _aiClient.GetRecommendationsAsync(projectId);
                ApplyRecommendations(comparisons, aiRecommendation, furnitureName);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error applying AI recommendations");
            }
            return comparisons;
        }

        private void ApplyRecommendations(
            List<PriceComparisonDto> comparisons,
            AIRecommendationResponseDto aiRecommendation,
            string furnitureName)
        {
            foreach (var comparison in comparisons)
            {
                var matchingRec = aiRecommendation.FurnitureRecommendations?
                    .FirstOrDefault(r => r.Name.Contains(furnitureName) &&
                                        r.PreferredStore?.Contains(comparison.StoreName) == true);

                if (matchingRec != null)
                {
                    comparison.IsRecommended = true;
                    comparison.RecommendationReason = matchingRec.RecommendationReason;
                }
            }
        }
    }
}
