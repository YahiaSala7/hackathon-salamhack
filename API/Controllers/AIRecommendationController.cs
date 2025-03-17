using Microsoft.AspNetCore.Mvc;
using SalamHack.Data.DTOS.Recommendation;
using SalamHack.Services.Interfaces;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIRecommendationController : ControllerBase
    {
        private readonly IAIRecommendationService _recommendationService;
        private readonly ILogger<AIRecommendationController> _logger;

        public AIRecommendationController(
            IAIRecommendationService recommendationService,
            ILogger<AIRecommendationController> logger)
        {
            _recommendationService = recommendationService ?? throw new ArgumentNullException(nameof(recommendationService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Gets AI recommendations for a project or specific room
        /// </summary>
        /// <param name="projectId">ID of the project</param>
        /// <param name="roomId">Optional: ID of a specific room</param>
        /// <returns>AI recommendations for furniture and budget</returns>
        [HttpGet("{projectId}")]
        [ProducesResponseType(typeof(AIRecommendationResponseDto), 200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> GetRecommendations(int projectId, [FromQuery] int? roomId = null)
        {
            try
            {
                _logger.LogInformation($"Getting AI recommendations for project {projectId}, room {roomId}");
                var recommendations = await _recommendationService.GetRecommendationsAsync(projectId, roomId);
                return Ok(recommendations);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, $"Invalid request for project {projectId}");
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting recommendations for project {projectId}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }

        /// <summary>
        /// Applies the provided AI recommendations to a project
        /// </summary>
        /// <param name="projectId">ID of the project</param>
        /// <param name="recommendations">Recommendations to apply</param>
        /// <returns>Success or failure status</returns>
        [HttpPost("{projectId}/apply")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> ApplyRecommendations(int projectId, [FromBody] AIRecommendationResponseDto recommendations)
        {
            if (recommendations == null)
            {
                return BadRequest("Recommendations cannot be null");
            }

            try
            {
                _logger.LogInformation($"Applying AI recommendations to project {projectId}");
                var result = await _recommendationService.ApplyRecommendationsAsync(projectId, recommendations);

                if (!result)
                {
                    return NotFound($"Project with ID {projectId} not found or recommendations could not be applied");
                }

                return Ok(new { success = true, message = "Recommendations applied successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error applying recommendations to project {projectId}");
                return StatusCode(500, "An error occurred while processing your request");
            }
        }
    }
}