using Microsoft.Extensions.Configuration;
using SalamHack.Data.DTOS;
using SalamHack.Services.infterface;

namespace SalamHack.Services
{
    public class PriceSearchApiClient : IExternalPriceApiClient
    {
        private readonly IConfiguration _configuration;
        private readonly IGeocodingService _geocodingService;

        public PriceSearchApiClient(
            IConfiguration configuration,
            IGeocodingService geocodingService)
        {
            _configuration = configuration;
            _geocodingService = geocodingService;
        }

        //public async Task<List<NearbyStoreDto>> SearchNearbyStoresAsync(string location, int radiusKm, int? furnitureId = null) { 
        
        //}
    }
}
