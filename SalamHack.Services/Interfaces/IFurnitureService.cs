using SalamHack.Data.DTOS.Furniture;

namespace SalamHack.Services.interfaces
{

    public interface IFurnitureService
    {
        Task<FurnitureDto> GetFurnitureByIdAsync(int furnitureId);
        Task<List<FurnitureDto>> GetRoomFurnitureAsync(int roomId);
        Task<FurnitureDto> CreateFurnitureAsync(FurnitureCreateDto furnitureCreateDto);
        Task<FurnitureDto> UpdateFurnitureAsync(int furnitureId, FurnitureCreateDto furnitureUpdateDto);
        Task<bool> DeleteFurnitureAsync(int furnitureId);
    }
}
