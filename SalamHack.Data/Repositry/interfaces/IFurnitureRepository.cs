using SalamHack.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalamHack.Data.Repositry.interfaces
{
    public interface IFurnitureRepository
    {
        Task<Furniture> GetByIdAsync(int furnitureId);
        Task<List<Furniture>> GetByRoomIdAsync(int roomId);
        Task<Furniture> CreateAsync(Furniture furniture);
        Task<Furniture> UpdateAsync(Furniture furniture);
        Task<bool> DeleteAsync(int furnitureId);
    }


}
