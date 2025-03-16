using SalamHack.Data.DTOS.Project;

namespace SalamHack.Services.Interfaces
{

    public interface IProjectService
    {
        Task<ProjectDto> GetProjectByIdAsync(int projectId);
        Task<ProjectDetailDto> GetProjectDetailsAsync(int projectId);
        Task<List<ProjectDto>> GetUserProjectsAsync(int userId);
        Task<ProjectDto> CreateProjectAsync(int userId, ProjectCreateDto projectCreateDto);
        Task<ProjectDto> UpdateProjectAsync(int projectId, ProjectCreateDto projectUpdateDto);
        Task<bool> DeleteProjectAsync(int projectId);
    }
}
