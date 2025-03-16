using AutoMapper;
using SalamHack.Data.DTOS.Project;
using SalamHack.Data.DTOS.Room;
using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;
using SalamHack.Services.Interfaces;

namespace SalamHack.Services.Services
{
    public class ProjectService : IProjectService
    {
        private readonly IProjectRepository _projectRepository;
        private readonly IRoomService _roomService;
        private readonly IGeocodingService _geocodingService;
        private readonly IMapper _mapper;

        public ProjectService(
            IProjectRepository projectRepository,
            IRoomService roomService,
            IGeocodingService geocodingService,
            IMapper mapper)
        {
            _projectRepository = projectRepository;
            _roomService = roomService;
            _geocodingService = geocodingService;
            _mapper = mapper;
        }

        public async Task<ProjectDto> GetProjectByIdAsync(int projectId)
        {
            var project = await _projectRepository.GetByIdAsync(projectId);
            return _mapper.Map<ProjectDto>(project);
        }

        public async Task<ProjectDetailDto> GetProjectDetailsAsync(int projectId)
        {
            var project = await _projectRepository.GetProjectWithDetailsAsync(projectId);
            return _mapper.Map<ProjectDetailDto>(project);
        }

        public async Task<List<ProjectDto>> GetUserProjectsAsync(int userId)
        {
            var projects = await _projectRepository.GetByUserIdAsync(userId);
            return _mapper.Map<List<ProjectDto>>(projects);
        }

        public async Task<ProjectDto> CreateProjectAsync(int userId, ProjectCreateDto projectCreateDto)
        {
            // تحويل الـ DTO إلى كيان باستخدام AutoMapper
            var projectEntity = _mapper.Map<Project>(projectCreateDto);
            //   projectEntity.UserId = userId; // تعيين المستخدم المُنشئ

            // التحقق من صحة الموقع باستخدام خدمة Geocoding
            try
            {
                var (latitude, longitude) = await _geocodingService.GetCoordinatesAsync(projectEntity.Location);
                // يمكن تخزين الإحداثيات في الكيان إذا كان لديك خصائص مخصصة
            }
            catch (Exception)
            {
                throw new ArgumentException("Invalid location provided. Please provide a valid address.");
            }

            // إنشاء المشروع
            var createdProject = await _projectRepository.CreateAsync(projectEntity);

            // إنشاء الغرف الافتراضية بناءً على عدد الغرف
            if (createdProject.RoomCount > 0)
            {
                // غرفة المعيشة
                await _roomService.CreateRoomAsync(new RoomCreateDto
                {
                    ProjectId = createdProject.ProjectId,
                    RoomType = "Living Room",
                    RoomSize = 25,
                    RoomBudget = createdProject.Budget * 0.3m
                });

                // المطبخ
                await _roomService.CreateRoomAsync(new RoomCreateDto
                {
                    ProjectId = createdProject.ProjectId,
                    RoomType = "Kitchen",
                    RoomSize = 20,
                    RoomBudget = createdProject.Budget * 0.25m
                });

                // غرفة النوم
                await _roomService.CreateRoomAsync(new RoomCreateDto
                {
                    ProjectId = createdProject.ProjectId,
                    RoomType = "Bedroom",
                    RoomSize = 18,
                    RoomBudget = createdProject.Budget * 0.20m
                });

                // الحمام
                await _roomService.CreateRoomAsync(new RoomCreateDto
                {
                    ProjectId = createdProject.ProjectId,
                    RoomType = "Bathroom",
                    RoomSize = 10,
                    RoomBudget = createdProject.Budget * 0.15m
                });

                // غرف إضافية إذا كان عدد الغرف أكبر من 4
                for (int i = 5; i <= createdProject.RoomCount; i++)
                {
                    await _roomService.CreateRoomAsync(new RoomCreateDto
                    {
                        ProjectId = createdProject.ProjectId,
                        RoomType = $"Additional Room {i - 4}",
                        RoomSize = 15,
                        RoomBudget = createdProject.Budget * 0.10m / (createdProject.RoomCount - 4)
                    });
                }
            }

            return _mapper.Map<ProjectDto>(createdProject);
        }

        public async Task<ProjectDto> UpdateProjectAsync(int projectId, ProjectCreateDto projectUpdateDto)
        {
            var existingProject = await _projectRepository.GetByIdAsync(projectId);
            if (existingProject == null)
                throw new ArgumentException("Project not found");

            // التحقق من صحة الموقع إذا تغير
            if (existingProject.Location != projectUpdateDto.Location)
            {
                try
                {
                    var (latitude, longitude) = await _geocodingService.GetCoordinatesAsync(projectUpdateDto.Location);
                    // يمكن تحديث الإحداثيات في الكيان إذا كان ذلك مطلوبًا
                }
                catch (Exception)
                {
                    throw new ArgumentException("Invalid location provided. Please provide a valid address.");
                }
            }

            // تحديث بيانات المشروع باستخدام AutoMapper
            _mapper.Map(projectUpdateDto, existingProject);
            var updatedProject = await _projectRepository.UpdateAsync(existingProject);
            return _mapper.Map<ProjectDto>(updatedProject);
        }

        public async Task<bool> DeleteProjectAsync(int projectId)
        {
            return await _projectRepository.DeleteAsync(projectId);
        }
    }
}
