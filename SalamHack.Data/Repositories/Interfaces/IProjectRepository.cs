using SalamHack.Models;

namespace SalamHack.Data.Repositories.Interfaces
{
    public interface IProjectRepository
    {
        Task<Project> GetByIdAsync(int projectId);
        Task<Project> GetProjectWithDetailsAsync(int projectId);
        Task<List<Project>> GetByUserIdAsync(int userId);
        Task<Project> CreateAsync(Project project);
        Task<Project> UpdateAsync(Project project);
        Task<bool> DeleteAsync(int projectId);
    }
}
