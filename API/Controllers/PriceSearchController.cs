using Microsoft.AspNetCore.Mvc;
using SalamHack.Data.DTOS.Furniture;
using SalamHack.Data.DTOS.PriceComparison;
using SalamHack.Data.DTOS.Store;
using SalamHack.Services.Interfaces;

namespace SalamHack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PriceSearchController : ControllerBase
    {
        private readonly IPriceSearchService _priceSearchService;
        private readonly ILogger<PriceSearchController> _logger;

        public PriceSearchController(
            IPriceSearchService priceSearchService,
            ILogger<PriceSearchController> logger)
        {
            _priceSearchService = priceSearchService ?? throw new ArgumentNullException(nameof(priceSearchService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Finds nearby stores for a project
        /// </summary>
        /// <param name="projectId">The project ID</param>
        /// <param name="radiusKm">Search radius in kilometers (default: 20)</param>
        /// <returns>List of nearby stores</returns>
        [HttpGet("project/{projectId}/nearby-stores")]
        [ProducesResponseType(typeof(List<NearbyStoreDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> FindNearbyStores(int projectId, [FromQuery] int radiusKm = 20)
        {
            try
            {
                _logger.LogInformation($"Finding nearby stores for project {projectId} within {radiusKm}km");
                var stores = await _priceSearchService.FindNearbyStoresAsync(projectId, radiusKm);
                return Ok(stores);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, $"Invalid request for project ID {projectId}");
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error finding nearby stores for project ID {projectId}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Finds furniture availability in nearby stores
        /// </summary>
        /// <param name="furnitureId">The furniture ID</param>
        /// <param name="projectId">The project ID</param>
        /// <param name="radiusKm">Search radius in kilometers (default: 20)</param>
        /// <returns>List of stores with furniture availability</returns>
        [HttpGet("furniture/{furnitureId}/project/{projectId}/availability")]
        [ProducesResponseType(typeof(List<FurnitureAvailabilityDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> FindFurnitureAvailability(int furnitureId, int projectId, [FromQuery] int radiusKm = 20)
        {
            try
            {
                _logger.LogInformation($"Finding availability for furniture {furnitureId} near project {projectId} within {radiusKm}km");
                var availability = await _priceSearchService.FindFurnitureAvailabilityAsync(furnitureId, projectId, radiusKm);
                return Ok(availability);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, $"Invalid request for furniture ID {furnitureId} or project ID {projectId}");
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error finding furniture availability for ID {furnitureId}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Searches for price comparisons by furniture name and category
        /// </summary>
        /// <param name="furnitureName">Name of the furniture</param>
        /// <param name="category">Furniture category</param>
        /// <returns>List of price comparisons</returns>
        [HttpGet("search")]
        [ProducesResponseType(typeof(List<PriceComparisonDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> SearchPriceComparisons([FromQuery] string furnitureName, [FromQuery] string category)
        {
            if (string.IsNullOrWhiteSpace(furnitureName) || string.IsNullOrWhiteSpace(category))
            {
                return BadRequest("Furniture name and category are required");
            }

            try
            {
                _logger.LogInformation($"Searching price comparisons for {furnitureName} in category {category}");
                var comparisons = await _priceSearchService.SearchPriceComparisonsAsync(furnitureName, category);
                return Ok(comparisons);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error searching price comparisons for {furnitureName}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }
    }
}