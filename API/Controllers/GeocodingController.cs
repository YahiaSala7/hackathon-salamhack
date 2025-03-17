using Microsoft.AspNetCore.Mvc;
using SalamHack.Services.Interfaces;

namespace SalamHack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GeocodingController : ControllerBase
    {
        private readonly IGeocodingService _geocodingService;
        private readonly ILogger<GeocodingController> _logger;

        public GeocodingController(IGeocodingService geocodingService, ILogger<GeocodingController> logger)
        {
            _geocodingService = geocodingService ?? throw new ArgumentNullException(nameof(geocodingService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Gets coordinates (latitude and longitude) for a given address
        /// </summary>
        /// <param name="address">The address to geocode</param>
        /// <returns>Coordinates of the address</returns>
        [HttpGet("coordinates")]
        [ProducesResponseType(typeof(CoordinatesResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCoordinates([FromQuery] string address)
        {
            if (string.IsNullOrWhiteSpace(address))
            {
                return BadRequest("Address cannot be null or empty");
            }

            try
            {
                _logger.LogInformation("Getting coordinates for address: {Address}", address);
                var (latitude, longitude) = await _geocodingService.GetCoordinatesAsync(address);

                return Ok(new CoordinatesResponse
                {
                    Latitude = latitude,
                    Longitude = longitude,
                    Address = address
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting coordinates for address: {Address}", address);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving coordinates");
            }
        }

        /// <summary>
        /// Gets an address for given coordinates (reverse geocoding)
        /// </summary>
        /// <param name="latitude">Latitude</param>
        /// <param name="longitude">Longitude</param>
        /// <returns>Address at the given coordinates</returns>
        [HttpGet("address")]
        [ProducesResponseType(typeof(AddressResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAddress([FromQuery] double latitude, [FromQuery] double longitude)
        {
            if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
            {
                return BadRequest("Invalid coordinates. Latitude must be between -90 and 90, and longitude must be between -180 and 180");
            }

            try
            {
                _logger.LogInformation("Getting address for coordinates: {Latitude}, {Longitude}", latitude, longitude);
                var address = await _geocodingService.GetAddressAsync(latitude, longitude);

                return Ok(new AddressResponse
                {
                    Latitude = latitude,
                    Longitude = longitude,
                    FormattedAddress = address
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting address for coordinates: {Latitude}, {Longitude}", latitude, longitude);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the address");
            }
        }

        /// <summary>
        /// Calculates the distance between two addresses
        /// </summary>
        /// <param name="address1">First address</param>
        /// <param name="address2">Second address</param>
        /// <returns>Distance in kilometers</returns>
        [HttpGet("distance")]
        [ProducesResponseType(typeof(DistanceResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CalculateDistance([FromQuery] string address1, [FromQuery] string address2)
        {
            if (string.IsNullOrWhiteSpace(address1) || string.IsNullOrWhiteSpace(address2))
            {
                return BadRequest("Both addresses must be provided");
            }

            try
            {
                _logger.LogInformation("Calculating distance between addresses: {Address1} and {Address2}", address1, address2);
                var distance = await _geocodingService.CalculateDistanceAsync(address1, address2);

                return Ok(new DistanceResponse
                {
                    Address1 = address1,
                    Address2 = address2,
                    DistanceKm = distance
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating distance between addresses: {Address1} and {Address2}", address1, address2);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while calculating the distance");
            }
        }
    }

    // Response models
    public class CoordinatesResponse
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Address { get; set; }
    }

    public class AddressResponse
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string FormattedAddress { get; set; }
    }

    public class DistanceResponse
    {
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public double DistanceKm { get; set; }
    }
}