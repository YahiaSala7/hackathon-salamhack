using SalamHack.Models;

namespace SalamHack.Data.Repositories.Interfaces
{
    public interface IReportRepository
    {
        Task<Report> GetByIdAsync(int reportId);
        Task<List<Report>> GetByProjectIdAsync(int projectId);
        Task<Report> GetLatestReportAsync(int projectId);
        Task<Report> CreateAsync(Report report);
        Task<Report> UpdateAsync(Report report);
        Task<bool> DeleteAsync(int reportId);
    }
}
