using SalamHack.Models;

namespace SalamHack.Data.Repositories.Interfaces
{
    public interface IRoomRepository
    {
        Task<Room> GetByIdAsync(int roomId);
        Task<List<Room>> GetByProjectIdAsync(int projectId);
        Task<Room> CreateAsync(Room room);
        Task<Room> UpdateAsync(Room room);
        Task<bool> DeleteAsync(int roomId);
    }
}
