using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using SalamHack.Data.DTOS.Room;
using SalamHack.Services.Interfaces;

namespace SalamHack.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly IRoomService _roomService;
        private readonly IMapper _mapper;

        public RoomsController(IRoomService roomService, IMapper mapper)
        {
            _roomService = roomService;
            _mapper = mapper;
        }

        // GET: api/rooms/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDto>> GetRoom(int id)
        {
            var room = await _roomService.GetRoomByIdAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            return Ok(room);
        }

        // GET: api/rooms/project/{projectId}
        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<List<RoomDto>>> GetProjectRooms(int projectId)
        {
            var rooms = await _roomService.GetProjectRoomsAsync(projectId);
            return Ok(rooms);
        }

        // POST: api/rooms
        [HttpPost]
        public async Task<ActionResult<RoomDto>> CreateRoom(RoomCreateDto roomCreateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdRoom = await _roomService.CreateRoomAsync(roomCreateDto);

            return CreatedAtAction(
                nameof(GetRoom),
                new { id = createdRoom.RoomId },
                createdRoom
            );
        }

        // PUT: api/rooms/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoom(int id, RoomCreateDto roomUpdateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updatedRoom = await _roomService.UpdateRoomAsync(id, roomUpdateDto);
                return Ok(updatedRoom);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("not found"))
                {
                    return NotFound();
                }
                return StatusCode(500, "An error occurred while updating the room");
            }
        }

        // DELETE: api/rooms/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var result = await _roomService.DeleteRoomAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}