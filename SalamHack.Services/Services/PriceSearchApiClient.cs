using SalamHack.Data.DTOS.Furniture;
using SalamHack.Data.DTOS.PriceComparison;
using SalamHack.Data.DTOS.Store;
using SalamHack.Data.Repositories.Interfaces;

namespace SalamHack.Services.Services
{
    public class PriceSearchService : IPriceSearchService
    {
        private readonly IExternalPriceApiClient _externalPriceApiClient;
        private readonly IGeocodingService _geocodingService;
        private readonly IProjectRepository _projectRepository;

        public PriceSearchService(
            IExternalPriceApiClient externalPriceApiClient,
            IGeocodingService geocodingService,
            IProjectRepository projectRepository)
        {
            _externalPriceApiClient = externalPriceApiClient;
            _geocodingService = geocodingService;
            _projectRepository = projectRepository;
        }

        public async Task<List<NearbyStoreDto>> FindNearbyStoresAsync(int projectId, int radiusKm = 20)
        {
            var project = await _projectRepository.GetByIdAsync(projectId);
            if (project == null)
                throw new ArgumentException("Project not found");

            return await _externalPriceApiClient.SearchNearbyStoresAsync(project.Location, radiusKm);
        }
        public async Task<List<FurnitureAvailabilityDto>> FindFurnitureAvailabilityAsync(int furnitureId, int projectId, int radiusKm = 20)
        {
            var project = await _projectRepository.GetByIdAsync(projectId);
            if (project == null)
                throw new ArgumentException("Project not found");

            return await _externalPriceApiClient.SearchFurnitureAvailabilityAsync(furnitureId, project.Location, radiusKm);
        }

        public async Task<List<PriceComparisonDto>> SearchPriceComparisonsAsync(string furnitureName, string category)
        {
            return await _externalPriceApiClient.GetPriceComparisonsAsync(furnitureName, category);
        }
    }
}

    }
