using AutoMapper;
using SalamHack.Data.DTOS.PriceComparison;
using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;
using SalamHack.Services.Interfaces;

namespace SalamHack.Services.Services
{
    public class PriceComparisonService : IPriceComparisonService
    {
        private readonly IPriceComparisonRepository _priceComparisonRepository;
        private readonly IFurnitureRepository _furnitureRepository;
        private readonly IExternalPriceApiClient _externalPriceApiClient;
        private readonly IGeocodingService _geocodingService;
        private readonly IProjectRepository _projectRepository;
        private readonly IMapper _mapper;

        public PriceComparisonService(
            IPriceComparisonRepository priceComparisonRepository,
            IFurnitureRepository furnitureRepository,
            IExternalPriceApiClient externalPriceApiClient,
            IGeocodingService geocodingService,
            IProjectRepository projectRepository,
            IMapper mapper)
        {
            _priceComparisonRepository = priceComparisonRepository;
            _furnitureRepository = furnitureRepository;
            _externalPriceApiClient = externalPriceApiClient;
            _geocodingService = geocodingService;
            _projectRepository = projectRepository;
            _mapper = mapper;
        }

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
            {
                return _mapper.Map<List<PriceComparisonDto>>(recentComparisons);
            }

            var room = await _furnitureRepository.GetByIdAsync(furniture.RoomId);
            var project = await _projectRepository.GetByIdAsync(room.ProjectId);

            var onlinePricesTask = _externalPriceApiClient.GetPriceComparisonsAsync(furniture.Name, furniture.Category);
            var nearbyStoresTask = _externalPriceApiClient.SearchNearbyStoresAsync(project.Location, 20, furnitureId);

            await Task.WhenAll(onlinePricesTask, nearbyStoresTask);

            var priceComparisons = await onlinePricesTask;
            var nearbyStores = await nearbyStoresTask;

            var newComparisons = new List<PriceComparison>();

            foreach (var comparison in priceComparisons)
            {
                var newComparison = new PriceComparison
                {
                    FurnitureId = furnitureId,
                    StoreName = comparison.StoreName,
                    Price = comparison.Price,
                    Url = comparison.StoreUrl,
                    CreatedAt = DateTime.Now
                };

                newComparisons.Add(newComparison);
                await _priceComparisonRepository.CreateAsync(newComparison);
            }

            var locationTasks = nearbyStores.Select(async store =>
            {
                double distance = await _geocodingService.CalculateDistanceAsync(project.Location, store.Address);
                return new { Store = store, Distance = distance };
            });

            var storesWithDistance = await Task.WhenAll(locationTasks);

            foreach (var item in storesWithDistance.Where(s => s.Distance <= 20))
            {
                var newComparison = new PriceComparison
                {
                    FurnitureId = furnitureId,
                    StoreName = item.Store.Name + $" ({item.Distance:F1}km away)",
                    Price = item.Store.Price,
                    Url = item.Store.Url,
                    CreatedAt = DateTime.Now
                };

                newComparisons.Add(newComparison);
                await _priceComparisonRepository.CreateAsync(newComparison);
            }

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
    }

}
