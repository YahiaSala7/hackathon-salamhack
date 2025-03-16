using SalamHack.Models;

namespace SalamHack.Services.Interfaces
{

    public interface IReportService
    {
        Task<Report> GetReportByIdAsync(int reportId);
        Task<List<Report>> GetReportsByProjectIdAsync(int projectId);
        Task<Report> GetLatestReportAsync(int projectId);
        Task<Report> GenerateReportAsync(int projectId, string additionalNotes = null);
        Task<Report> UpdateReportAsync(Report report);
        Task<bool> DeleteReportAsync(int reportId);

    }
}
