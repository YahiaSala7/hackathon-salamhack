using SalamHack.Data.Repositry.interfaces;
using SalamHack.Data;
using SalamHack.Models;
using Microsoft.EntityFrameworkCore;

namespace SalamHack.Data.Repositry
{
    public class ReportRepository : IReportRepository
    {
        private readonly ApplicationDbContext _context;

        public ReportRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Report> GetByIdAsync(int reportId)
        {
            return await _context.Reports.FindAsync(reportId);
        }

        public async Task<List<Report>> GetByProjectIdAsync(int projectId)
        {
            return await _context.Reports
                .Where(r => r.ProjectId == projectId)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<Report> GetLatestReportAsync(int projectId)
        {
            return await _context.Reports
                .Where(r => r.ProjectId == projectId)
                .OrderByDescending(r => r.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<Report> CreateAsync(Report report)
        {
            report.CreatedAt = DateTime.UtcNow;

            _context.Reports.Add(report);
            await _context.SaveChangesAsync();

            return report;
        }

        public async Task<Report> UpdateAsync(Report report)
        {
            _context.Reports.Update(report);
            await _context.SaveChangesAsync();

            return report;
        }

        public async Task<bool> DeleteAsync(int reportId)
        {
            var report = await _context.Reports.FindAsync(reportId);
            if (report == null)
                return false;

            _context.Reports.Remove(report);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}



