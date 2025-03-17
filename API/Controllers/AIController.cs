using Microsoft.AspNetCore.Mvc;
using SalamHack.Data.DTOS.Recommendation;
using SalamHack.Services.Interfaces;

namespace SalamHack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly IAIClient _aiClient;
        private readonly ILogger<AIController> _logger;

        public AIController(IAIClient aiClient, ILogger<AIController> logger)
        {
            _aiClient = aiClient ?? throw new ArgumentNullException(nameof(aiClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Gets AI-generated furniture and appliance recommendations for a project or specific room
        /// </summary>
        /// <param name="projectId">The ID of the project</param>
        /// <param name="roomId">Optional ID of a specific room</param>
        /// <returns>AI recommendations for furniture and appliances</returns>
        [HttpGet("recommendations")]
        [ProducesResponseType(typeof(AIRecommendationResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetRecommendations([FromQuery] int projectId, [FromQuery] int? roomId = null)
        {
            if (projectId <= 0)
            {
                return BadRequest("Invalid project ID");
            }

            try
            {
                _logger.LogInformation("Getting AI recommendations for project {ProjectId}, room {RoomId}", projectId, roomId);
                var recommendations = await _aiClient.GetRecommendationsAsync(projectId, roomId);

                if (recommendations == null)
                {
                    return NotFound($"No recommendations found for project ID {projectId}");
                }

                return Ok(recommendations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting AI recommendations for project {ProjectId}, room {RoomId}", projectId, roomId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving recommendations");
            }
        }

        /// <summary>
        /// Generates a comprehensive home setup report for a project
        /// </summary>
        /// <param name="projectId">The ID of the project</param>
        /// <param name="request">Additional notes for the report (optional)</param>
        /// <returns>AI-generated report</returns>
        [HttpPost("reports")]
        [ProducesResponseType(typeof(ReportResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GenerateReport([FromQuery] int projectId, [FromBody] ReportRequestDto request)
        {
            if (projectId <= 0)
            {
                return BadRequest("Invalid project ID");
            }

            try
            {
                _logger.LogInformation("Generating AI report for project {ProjectId}", projectId);
                var additionalNotes = request?.AdditionalNotes ?? string.Empty;
                var report = await _aiClient.GenerateReportAsync(projectId, additionalNotes);

                return Ok(new ReportResponseDto
                {
                    ProjectId = projectId,
                    Report = report,
                    GeneratedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating AI report for project {ProjectId}", projectId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while generating the report");
            }
        }

        /// <summary>
        /// Handles errors from the OpenAI API
        /// </summary>
        [Route("error")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public IActionResult HandleError()
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while processing the AI request");
        }
    }

    // Request and response DTOs
    public class ReportRequestDto
    {
        public string AdditionalNotes { get; set; }
    }

    public class ReportResponseDto
    {
        public int ProjectId { get; set; }
        public string Report { get; set; }
        public DateTime GeneratedAt { get; set; }
    }
}