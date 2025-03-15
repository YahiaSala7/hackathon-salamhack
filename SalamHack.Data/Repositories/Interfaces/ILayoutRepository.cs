using SalamHack.Models;

namespace SalamHack.Data.Repositories.Interfaces
{
    public interface ILayoutRepository
    {
        Task<Layout> GetByIdAsync(int layoutId);
        Task<List<Layout>> GetByProjectIdAsync(int projectId);
        Task<Layout> GetCurrentLayoutAsync(int projectId);
        Task<Layout> CreateAsync(Layout layout);
        Task<Layout> UpdateAsync(Layout layout);
        Task<bool> DeleteAsync(int layoutId);
    }
}
