using SalamHack.Data.DTOS.Room;

namespace SalamHack.Services.interfaces
{

    public interface IRoomService
    {
        Task<RoomDto> GetRoomByIdAsync(int roomId);
        Task<List<RoomDto>> GetProjectRoomsAsync(int projectId);
        Task<RoomDto> CreateRoomAsync(RoomCreateDto roomCreateDto);
        Task<RoomDto> UpdateRoomAsync(int roomId, RoomCreateDto roomUpdateDto);
        Task<bool> DeleteRoomAsync(int roomId);
    }
}
