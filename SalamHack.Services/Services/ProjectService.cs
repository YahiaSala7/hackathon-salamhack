using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;

namespace SalamHack.Services.Services;
public class ProjectService : IProjectService
{
    private readonly IProjectRepository _projectRepository;
    private readonly IRoomService _roomService;
    private readonly IGeocodingService _geocodingService;

    public ProjectService(
        IProjectRepository projectRepository,
        IRoomService roomService,
        IGeocodingService geocodingService)
    {
        _projectRepository = projectRepository;
        _roomService = roomService;
        _geocodingService = geocodingService;
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

    public async Task<Project> CreateProjectAsync(Project project)
    {
        // Validate the location using geocoding service
        try
        {
            var (latitude, longitude) = await _geocodingService.GetCoordinatesAsync(project.Location);
            // Could store these coordinates if needed for future reference
        }
        catch (Exception)
        {
            throw new ArgumentException("Invalid location provided. Please provide a valid address.");
        }

        // Create the project
        var createdProject = await _projectRepository.CreateAsync(project);

        // Create default rooms based on room count
        if (createdProject.RoomCount > 0)
        {
            // Create a living room by default
            await _roomService.CreateRoomAsync(new Room
            {
                ProjectId = createdProject.ProjectId,
                RoomType = "Living Room",
                RoomSize = 25, // Default size
                RoomBudget = createdProject.Budget * 0.3m // Allocate 30% to living room by default
            });

            // Create a kitchen by default
            await _roomService.CreateRoomAsync(new Room
            {
                ProjectId = createdProject.ProjectId,
                RoomType = "Kitchen",
                RoomSize = 20, // Default size
                RoomBudget = createdProject.Budget * 0.25m // Allocate 25% to kitchen by default
            });

            // Create a bedroom
            await _roomService.CreateRoomAsync(new Room
            {
                ProjectId = createdProject.ProjectId,
                RoomType = "Bedroom",
                RoomSize = 18, // Default size
                RoomBudget = createdProject.Budget * 0.20m // Allocate 20% to bedroom by default
            });

            // Create a bathroom
            await _roomService.CreateRoomAsync(new Room
            {
                ProjectId = createdProject.ProjectId,
                RoomType = "Bathroom",
                RoomSize = 10, // Default size
                RoomBudget = createdProject.Budget * 0.15m // Allocate 15% to bathroom by default
            });

            // Create additional bedrooms if room count is greater than 4
            for (int i = 5; i <= createdProject.RoomCount; i++)
            {
                await _roomService.CreateRoomAsync(new Room
                {
                    ProjectId = createdProject.ProjectId,
                    RoomType = $"Additional Room {i-4}",
                    RoomSize = 15, // Default size
                    RoomBudget = createdProject.Budget * 0.10m / (createdProject.RoomCount - 4) // Allocate remaining budget evenly
                });
            }
        }

        return createdProject;
    }

    public async Task<Project> UpdateProjectAsync(Project project)
    {
        // Validate the location using geocoding service if it has changed
        var existingProject = await _projectRepository.GetByIdAsync(project.ProjectId);
        if (existingProject.Location != project.Location)
        {
            try
            {
                var (latitude, longitude) = await _geocodingService.GetCoordinatesAsync(project.Location);
                // Could store these coordinates if needed for future reference
            }
            catch (Exception)
            {
                throw new ArgumentException("Invalid location provided. Please provide a valid address.");
            }
        }

        return await _projectRepository.UpdateAsync(project);
    }

    public async Task<bool> DeleteProjectAsync(int projectId)
    {
        return await _projectRepository.DeleteAsync(projectId);
    }
}
}
