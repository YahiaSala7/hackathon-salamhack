using Microsoft.AspNetCore.Mvc;
using SalamHack.Data.DTOS.Project;
using SalamHack.Services.Interfaces;

namespace SalamHack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly ILogger<ProjectController> _logger;

        public ProjectController(IProjectService projectService, ILogger<ProjectController> logger)
        {
            _projectService = projectService ?? throw new ArgumentNullException(nameof(projectService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Gets a project by ID
        /// </summary>
        /// <param name="id">The project ID</param>
        /// <returns>Project information</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetProject(int id)
        {
            try
            {
                _logger.LogInformation("Getting project with ID: {ProjectId}", id);
                var project = await _projectService.GetProjectByIdAsync(id);

                if (project == null)
                {
                    return NotFound($"Project with ID {id} not found");
                }

                return Ok(project);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving project with ID: {ProjectId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the project");
            }
        }

        /// <summary>
        /// Gets detailed project information including rooms and furniture
        /// </summary>
        /// <param name="id">The project ID</param>
        /// <returns>Detailed project information</returns>
        [HttpGet("{id}/details")]
        [ProducesResponseType(typeof(ProjectDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetProjectDetails(int id)
        {
            try
            {
                _logger.LogInformation("Getting detailed project information for ID: {ProjectId}", id);
                var projectDetails = await _projectService.GetProjectDetailsAsync(id);

                if (projectDetails == null)
                {
                    return NotFound($"Project with ID {id} not found");
                }

                return Ok(projectDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving detailed project information for ID: {ProjectId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the project details");
            }
        }

        /// <summary>
        /// Gets all projects for a user
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <returns>List of projects</returns>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(List<ProjectDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetUserProjects(int userId)
        {
            try
            {
                _logger.LogInformation("Getting projects for user ID: {UserId}", userId);
                var projects = await _projectService.GetUserProjectsAsync(userId);
                return Ok(projects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving projects for user ID: {UserId}", userId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while retrieving the user's projects");
            }
        }

        /// <summary>
        /// Creates a new project
        /// </summary>
        /// <param name="userId">The user ID</param>
        /// <param name="projectCreateDto">Project creation data</param>
        /// <returns>Created project information</returns>
        [HttpPost("user/{userId}")]
        [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateProject(int userId, [FromBody] ProjectCreateDto projectCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _logger.LogInformation("Creating new project for user ID: {UserId}", userId);
                var createdProject = await _projectService.CreateProjectAsync(userId, projectCreateDto);

                return CreatedAtAction(nameof(GetProject), new { id = createdProject.ProjectId }, createdProject);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid input for project creation: {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating project for user ID: {UserId}", userId);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while creating the project");
            }
        }

        /// <summary>
        /// Updates an existing project
        /// </summary>
        /// <param name="id">The project ID</param>
        /// <param name="projectUpdateDto">Project update data</param>
        /// <returns>Updated project information</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ProjectDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] ProjectCreateDto projectUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _logger.LogInformation("Updating project with ID: {ProjectId}", id);
                var updatedProject = await _projectService.UpdateProjectAsync(id, projectUpdateDto);

                return Ok(updatedProject);
            }
            catch (ArgumentException ex) when (ex.Message.Contains("not found"))
            {
                _logger.LogWarning("Project with ID {ProjectId} not found for update", id);
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid input for project update: {Message}", ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating project with ID: {ProjectId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while updating the project");
            }
        }

        /// <summary>
        /// Deletes a project
        /// </summary>
        /// <param name="id">The project ID</param>
        /// <returns>Success or failure status</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteProject(int id)
        {
            try
            {
                _logger.LogInformation("Deleting project with ID: {ProjectId}", id);
                var result = await _projectService.DeleteProjectAsync(id);

                if (!result)
                {
                    return NotFound($"Project with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting project with ID: {ProjectId}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, "An error occurred while deleting the project");
            }
        }
    }
}