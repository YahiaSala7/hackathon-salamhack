using SalamHack.Models;

namespace SalamHack.Services.Services
{
    public class RoomService : IRoomService
    {
        private readonly IRoomRepository _roomRepository;

        public RoomService(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
        }

        public async Task<Room> GetRoomByIdAsync(int roomId)
        {
            return await _roomRepository.GetByIdAsync(roomId);
        }

        public async Task<List<Room>> GetRoomsByProjectIdAsync(int projectId)
        {
            return await _roomRepository.GetByProjectIdAsync(projectId);
        }

        public async Task<Room> CreateRoomAsync(Room room)
        {
            return await _roomRepository.CreateAsync(room);
        }

        public async Task<Room> UpdateRoomAsync(Room room)
        {
            return await _roomRepository.UpdateAsync(room);
        }

        public async Task<bool> DeleteRoomAsync(int roomId)
        {
            return await _roomRepository.DeleteAsync(roomId);
        }
    }
}
