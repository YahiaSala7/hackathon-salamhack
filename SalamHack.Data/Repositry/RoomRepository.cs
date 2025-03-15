using Microsoft.EntityFrameworkCore;
using SalamHack.Data;
using SalamHack.Models;

namespace SalamHack.Data.Repositry
{
    public class RoomRepository : IRoomRepository
    {
        private readonly ApplicationDbContext _context;

        public RoomRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Room> GetByIdAsync(int roomId)
        {
            return await _context.Rooms.FindAsync(roomId);
        }

        public async Task<List<Room>> GetByProjectIdAsync(int projectId)
        {
            return await _context.Rooms
                .Where(r => r.ProjectId == projectId)
                .Include(r => r.Furniture)
                .ToListAsync();
        }

        public async Task<Room> CreateAsync(Room room)
        {

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return room;
        }

        public async Task<Room> UpdateAsync(Room room)
        {

            _context.Rooms.Update(room);
            await _context.SaveChangesAsync();

            return room;
        }

        public async Task<bool> DeleteAsync(int roomId)
        {
            var room = await _context.Rooms.FindAsync(roomId);
            if (room == null)
                return false;

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}



