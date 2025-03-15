using SalamHack.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalamHack.Data.Repositry.interfaces
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
