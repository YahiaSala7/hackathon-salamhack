using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using SalamHack.Services.Interfaces;
using System.Text.Json;

namespace SalamHack.Services.Services
{
    public class GeocodingService : IGeocodingService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly GeocodingSettings _settings;
        private readonly IMemoryCache _cache;
        private const string BaseUrl = "https://maps.googleapis.com/maps/api/geocode/json";
        private const double EarthRadiusKm = 6371.0;
        private const string HttpClientName = "GoogleMapsClient";

        // Cache expiration settings
        private readonly TimeSpan _cacheDuration = TimeSpan.FromDays(30); // Addresses don't change often

        public GeocodingService(
            IHttpClientFactory httpClientFactory,
            IOptions<GeocodingSettings> settings,
            IMemoryCache cache)
        {
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _settings = settings?.Value ?? throw new ArgumentNullException(nameof(settings));
            _cache = cache ?? throw new ArgumentNullException(nameof(cache));
        }

        public async Task<(double latitude, double longitude)> GetCoordinatesAsync(string address)
        {
            if (string.IsNullOrWhiteSpace(address))
                throw new ArgumentException("Address cannot be null or empty", nameof(address));

            // Normalize the address to increase cache hits
            string normalizedAddress = NormalizeAddress(address);

            // Create a cache key
            string cacheKey = $"coordinates_{normalizedAddress}";

            // Try to get from cache first
            if (_cache.TryGetValue(cacheKey, out (double latitude, double longitude) coordinates))
            {
                return coordinates;
            }

            // Cache miss - call the API
            var httpClient = _httpClientFactory.CreateClient(HttpClientName);
            var requestUrl = $"{BaseUrl}?address={Uri.EscapeDataString(address)}&key={_settings.ApiKey}";
            var response = await httpClient.GetStringAsync(requestUrl);
            var geocodingResponse = JsonSerializer.Deserialize<GeocodeResponse>(response);

            if (geocodingResponse?.Status != "OK" || geocodingResponse.Results.Length == 0)
                throw new InvalidOperationException($"Failed to geocode address: {address}");

            var location = geocodingResponse.Results[0].Geometry.Location;
            coordinates = (location.Lat, location.Lng);

            // Store in cache
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(_cacheDuration);

            _cache.Set(cacheKey, coordinates, cacheOptions);

            return coordinates;
        }

        public async Task<string> GetAddressAsync(double latitude, double longitude)
        {
            // Create a cache key with limited precision to increase cache hits
            string cacheKey = $"address_{Math.Round(latitude, 6)}_{Math.Round(longitude, 6)}";

            // Try to get from cache first
            if (_cache.TryGetValue(cacheKey, out string cachedAddress))
            {
                return cachedAddress;
            }

            // Cache miss - call the API
            var httpClient = _httpClientFactory.CreateClient(HttpClientName);
            var requestUrl = $"{BaseUrl}?latlng={latitude},{longitude}&key={_settings.ApiKey}";
            var response = await httpClient.GetStringAsync(requestUrl);
            var geocodingResponse = JsonSerializer.Deserialize<GeocodeResponse>(response);

            if (geocodingResponse?.Status != "OK" || geocodingResponse.Results.Length == 0)
                throw new InvalidOperationException($"Failed to reverse geocode coordinates: {latitude}, {longitude}");

            string address = geocodingResponse.Results[0].FormattedAddress;

            // Store in cache
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(_cacheDuration);

            _cache.Set(cacheKey, address, cacheOptions);

            return address;
        }

        public async Task<double> CalculateDistanceAsync(string address1, string address2)
        {
            // Create a cache key (order addresses alphabetically to increase cache hits)
            string[] addresses = new[] { address1, address2 };
            Array.Sort(addresses);
            string cacheKey = $"distance_{NormalizeAddress(addresses[0])}_{NormalizeAddress(addresses[1])}";

            // Try to get from cache first
            if (_cache.TryGetValue(cacheKey, out double cachedDistance))
            {
                return cachedDistance;
            }

            // Cache miss - calculate the distance
            var coordinates1 = await GetCoordinatesAsync(address1);
            var coordinates2 = await GetCoordinatesAsync(address2);

            double distance = CalculateHaversineDistance(coordinates1.latitude, coordinates1.longitude,
                                                       coordinates2.latitude, coordinates2.longitude);

            // Store in cache
            var cacheOptions = new MemoryCacheEntryOptions()
                .SetAbsoluteExpiration(_cacheDuration);

            _cache.Set(cacheKey, distance, cacheOptions);

            return distance;
        }

        private double CalculateHaversineDistance(double lat1, double lon1, double lat2, double lon2)
        {
            var dLat = ToRadians(lat2 - lat1);
            var dLon = ToRadians(lon2 - lon1);

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians(lat1)) * Math.Cos(ToRadians(lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return EarthRadiusKm * c;
        }

        private double ToRadians(double degrees)
        {
            return degrees * Math.PI / 180;
        }

        private string NormalizeAddress(string address)
        {
            // Simple normalization: lowercase and remove extra spaces
            return address.ToLowerInvariant().Trim().Replace("  ", " ");
        }
    }

    // Settings class for configuration
    public class GeocodingSettings
    {
        public string ApiKey { get; set; } = string.Empty;
        public string BaseUrl { get; set; } = string.Empty;
    }

    // Helper classes for JSON deserialization
    public class GeocodeResponse
    {
        public string Status { get; set; }
        public GeocodeResult[] Results { get; set; }
    }

    public class GeocodeResult
    {
        public string FormattedAddress { get; set; }
        public Geometry Geometry { get; set; }
    }

    public class Geometry
    {
        public Location Location { get; set; }
    }

    public class Location
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}