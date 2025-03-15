using SalamHack.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalamHack.Data.Repositry.interfaces
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
