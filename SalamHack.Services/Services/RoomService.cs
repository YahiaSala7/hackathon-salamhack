using AutoMapper;
using SalamHack.Data.DTOS.Room;
using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;
using SalamHack.Services.Interfaces;

namespace SalamHack.Services.Services
{
    public class RoomService : IRoomService
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IMapper _mapper;

        public RoomService(IRoomRepository roomRepository, IMapper mapper)
        {
            _roomRepository = roomRepository;
            _mapper = mapper;
        }

        public async Task<RoomDto> GetRoomByIdAsync(int roomId)
        {
            var room = await _roomRepository.GetByIdAsync(roomId);
            return _mapper.Map<RoomDto>(room);
        }

        public async Task<List<RoomDto>> GetProjectRoomsAsync(int projectId)
        {
            var rooms = await _roomRepository.GetByProjectIdAsync(projectId);
            return _mapper.Map<List<RoomDto>>(rooms);
        }

        public async Task<RoomDto> CreateRoomAsync(RoomCreateDto roomCreateDto)
        {
            // تحويل DTO إلى كيان باستخدام AutoMapper
            var roomEntity = _mapper.Map<Room>(roomCreateDto);
            var createdRoom = await _roomRepository.CreateAsync(roomEntity);
            return _mapper.Map<RoomDto>(createdRoom);
        }

        public async Task<RoomDto> UpdateRoomAsync(int roomId, RoomCreateDto roomUpdateDto)
        {
            var existingRoom = await _roomRepository.GetByIdAsync(roomId);
            if (existingRoom == null)
            {
                throw new Exception("Room not found");
            }

            // تحديث الكيان باستخدام AutoMapper (تحديث الخصائص الموجودة)
            _mapper.Map(roomUpdateDto, existingRoom);
            var updatedRoom = await _roomRepository.UpdateAsync(existingRoom);
            return _mapper.Map<RoomDto>(updatedRoom);
        }

        public async Task<bool> DeleteRoomAsync(int roomId)
        {
            return await _roomRepository.DeleteAsync(roomId);
        }
    }
}
