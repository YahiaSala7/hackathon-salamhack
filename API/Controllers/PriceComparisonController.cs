using Microsoft.AspNetCore.Mvc;
using SalamHack.Data.DTOS.PriceComparison;
using SalamHack.Services.Interfaces;

namespace SalamHack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PriceComparisonController : ControllerBase
    {
        private readonly IPriceComparisonService _priceComparisonService;
        private readonly ILogger<PriceComparisonController> _logger;

        public PriceComparisonController(
            IPriceComparisonService priceComparisonService,
            ILogger<PriceComparisonController> logger)
        {
            _priceComparisonService = priceComparisonService ?? throw new ArgumentNullException(nameof(priceComparisonService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Gets a price comparison by ID
        /// </summary>
        /// <param name="id">The price comparison ID</param>
        /// <returns>Price comparison details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PriceComparisonDto), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                _logger.LogInformation($"Getting price comparison with ID {id}");
                var priceComparison = await _priceComparisonService.GetPriceComparisonByIdAsync(id);

                if (priceComparison == null)
                {
                    return NotFound($"Price comparison with ID {id} not found");
                }

                return Ok(priceComparison);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving price comparison with ID {id}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Gets all price comparisons for a furniture item
        /// </summary>
        /// <param name="furnitureId">The furniture ID</param>
        /// <returns>List of price comparisons</returns>
        [HttpGet("furniture/{furnitureId}")]
        [ProducesResponseType(typeof(List<PriceComparisonDto>), 200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetByFurnitureId(int furnitureId)
        {
            try
            {
                _logger.LogInformation($"Getting price comparisons for furniture ID {furnitureId}");
                var comparisons = await _priceComparisonService.GetFurniturePriceComparisonsAsync(furnitureId);

                if (comparisons == null || !comparisons.Any())
                {
                    return NotFound($"No price comparisons found for furniture ID {furnitureId}");
                }

                return Ok(comparisons);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving price comparisons for furniture ID {furnitureId}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Gets or generates price comparisons for a furniture item
        /// </summary>
        /// <param name="furnitureId">The furniture ID</param>
        /// <returns>List of price comparisons</returns>
        [HttpGet("furniture/{furnitureId}/compare")]
        [ProducesResponseType(typeof(List<PriceComparisonDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetPriceComparisonsForFurniture(int furnitureId)
        {
            try
            {
                _logger.LogInformation($"Getting or generating price comparisons for furniture ID {furnitureId}");
                var comparisons = await _priceComparisonService.GetFurniturePriceComparisonsAsync(furnitureId);
                return Ok(comparisons);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, $"Invalid request for furniture ID {furnitureId}");
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving price comparisons for furniture ID {furnitureId}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Creates a new price comparison
        /// </summary>
        /// <param name="priceComparisonDto">The price comparison data</param>
        /// <returns>The created price comparison</returns>
        [HttpPost]
        [ProducesResponseType(typeof(PriceComparisonDto), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Create([FromBody] PriceComparisonCreateDto priceComparisonDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _logger.LogInformation("Creating new price comparison");
                var createdComparison = await _priceComparisonService.CreatePriceComparisonAsync(priceComparisonDto);
                return CreatedAtAction(nameof(GetById), new { id = createdComparison.ComparisonId }, createdComparison);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating price comparison");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Updates an existing price comparison
        /// </summary>
        /// <param name="id">The price comparison ID</param>
        /// <param name="priceComparisonDto">The updated price comparison data</param>
        /// <returns>The updated price comparison</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(PriceComparisonDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Update(int id, [FromBody] PriceComparisonCreateDto priceComparisonDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _logger.LogInformation($"Updating price comparison with ID {id}");
                var updatedComparison = await _priceComparisonService.UpdatePriceComparisonAsync(id, priceComparisonDto);
                return Ok(updatedComparison);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, $"Price comparison with ID {id} not found");
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating price comparison with ID {id}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Deletes a price comparison
        /// </summary>
        /// <param name="id">The price comparison ID</param>
        /// <returns>Success or failure status</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                _logger.LogInformation($"Deleting price comparison with ID {id}");
                var result = await _priceComparisonService.DeletePriceComparisonAsync(id);

                if (!result)
                {
                    return NotFound($"Price comparison with ID {id} not found");
                }

                return Ok(new { success = true, message = "Price comparison deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting price comparison with ID {id}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Gets AI enhanced price comparisons for a furniture item
        /// </summary>
        /// <param name="furnitureId">The furniture ID</param>
        /// <param name="projectId">The project ID</param>
        /// <returns>AI enhanced price comparisons</returns>
        [HttpGet("furniture/{furnitureId}/project/{projectId}/enhanced")]
        [ProducesResponseType(typeof(List<PriceComparisonDto>), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetAIEnhancedComparisons(int furnitureId, int projectId)
        {
            try
            {
                _logger.LogInformation($"Getting AI enhanced comparisons for furniture ID {furnitureId} in project {projectId}");
                var enhancedComparisons = await _priceComparisonService.GetAIEnhancedPriceComparisonsAsync(furnitureId, projectId);
                return Ok(enhancedComparisons);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, $"Invalid request for furniture ID {furnitureId} or project ID {projectId}");
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error retrieving AI enhanced comparisons for furniture ID {furnitureId}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }
    }
}