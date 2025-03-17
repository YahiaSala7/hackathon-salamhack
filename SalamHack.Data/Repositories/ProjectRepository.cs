using Microsoft.EntityFrameworkCore;
using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;

namespace SalamHack.Data.Repositories
{
    public class ProjectRepository : IProjectRepository
    {
        private readonly ApplicationDbContext _context;

        public ProjectRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Project> GetByIdAsync(int projectId)
        {
            return await _context.Projects.FindAsync(projectId);
        }

        public async Task<Project> GetProjectWithDetailsAsync(int projectId)
        {
            return await _context.Projects
                .Include(p => p.Rooms)
                    .ThenInclude(r => r.Furniture)
                        .ThenInclude(f => f.PriceComparisons)
                .Include(p => p.Layouts)
                .Include(p => p.Reports)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);
        }

        public async Task<List<Project>> GetByUserIdAsync(int userId)
        {
            return await _context.Projects
                .Where(p => p.ProjectId == userId)
                .ToListAsync();
        }

        public async Task<Project> CreateAsync(Project project)
        {
            // project.CreatedAt = DateTime.UtcNow;
            // project.UpdatedAt = DateTime.UtcNow;

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return project;
        }

        public async Task<Project> UpdateAsync(Project project)
        {
            // project.UpdatedAt = DateTime.UtcNow;

            _context.Projects.Update(project);
            await _context.SaveChangesAsync();

            return project;
        }

        public async Task<bool> DeleteAsync(int projectId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null)
                return false;

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}



