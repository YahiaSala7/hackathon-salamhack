using SalamHack.Models;

namespace SalamHack.Data.Repositories.Interfaces
{
    public interface IFurnitureRepository
    {
        Task<Furniture> GetByIdAsync(int furnitureId);
        Task<List<Furniture>> GetByRoomIdAsync(int roomId);
        Task<Room> GetRoomByFurnitureIdAsync(int furnitureId);
        Task<Furniture> CreateAsync(Furniture furniture);
        Task<Furniture> UpdateAsync(Furniture furniture);
        Task<bool> DeleteAsync(int furnitureId);
    }


}
