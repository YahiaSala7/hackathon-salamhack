using SalamHack.Data.Repositry.interfaces;
using SalamHack.Models;

namespace SalamHack.Services;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _projectRepository;
    private readonly IRoomService _roomService;

    public ProjectService(IProjectRepository projectRepository, IRoomService roomService)
    {
        _projectRepository = projectRepository;
        _roomService = roomService;
    }

    public async Task<Project> GetProjectByIdAsync(int projectId)
    {
        return await _projectRepository.GetByIdAsync(projectId);
    }

    public async Task<Project> GetProjectWithDetailsAsync(int projectId)
    {
        return await _projectRepository.GetProjectWithDetailsAsync(projectId);
    }

    public async Task<List<Project>> GetProjectsByUserIdAsync(int userId)
    {
        return await _projectRepository.GetByUserIdAsync(userId);
    }
}
