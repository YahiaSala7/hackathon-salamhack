using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;
using SalamHack.Services.Interfaces;

namespace SalamHack.Services.Services
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _reportRepository;
        private readonly IProjectRepository _projectRepository;
        private readonly IAIClient _aiClient;

        public ReportService(
            IReportRepository reportRepository,
            IProjectRepository projectRepository,
            IAIClient aiClient)
        {
            _reportRepository = reportRepository;
            _projectRepository = projectRepository;
            _aiClient = aiClient;
        }

        public async Task<Report> GetReportByIdAsync(int reportId)
        {
            return await _reportRepository.GetByIdAsync(reportId);
        }

        public async Task<List<Report>> GetReportsByProjectIdAsync(int projectId)
        {
            return await _reportRepository.GetByProjectIdAsync(projectId);
        }

        public async Task<Report> GetLatestReportAsync(int projectId)
        {
            return await _reportRepository.GetLatestReportAsync(projectId);
        }

        public async Task<Report> GenerateReportAsync(int projectId, string additionalNotes = null)
        {
            // Get complete project details
            var project = await _projectRepository.GetProjectWithDetailsAsync(projectId);
            if (project == null)
                throw new ArgumentException("Project not found");

            // Use AI service to generate a comprehensive report
            string reportUrl = await _aiClient.GenerateReportAsync(projectId, additionalNotes);

            // Create a summary for the report
            string summary = $"Smart Home Setup Report for {project.Location} - {project.StylePreference} style, " +
                             $"{project.RoomCount} rooms, Budget: ${project.Budget}";

            // Create and save the report
            var report = new Report
            {
                ProjectId = projectId,
                ReportUrl = reportUrl,
                Summary = summary
            };
            return await _reportRepository.CreateAsync(report);
        }

        public async Task<Report> UpdateReportAsync(Report report)
        {
            return await _reportRepository.UpdateAsync(report);
        }

        public async Task<bool> DeleteReportAsync(int reportId)
        {
            return await _reportRepository.DeleteAsync(reportId);
        }
    }


}
