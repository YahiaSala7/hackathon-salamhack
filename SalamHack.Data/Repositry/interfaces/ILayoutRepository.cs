using SalamHack.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalamHack.Data.Repositry.interfaces
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
