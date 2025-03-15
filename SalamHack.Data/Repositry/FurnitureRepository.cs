﻿using SalamHack.Data.Repositry.interfaces;
using SalamHack.Data;
using SalamHack.Models;
using Microsoft.EntityFrameworkCore;

namespace SalamHack.Data.Repositry
{
    public class FurnitureRepository : IFurnitureRepository
    {
        private readonly ApplicationDbContext _context;

        public FurnitureRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Furniture> GetByIdAsync(int furnitureId)
        {
            return await _context.Furniture
                .Include(f => f.PriceComparisons)
                .FirstOrDefaultAsync(f => f.FurnitureId == furnitureId);
        }

        public async Task<List<Furniture>> GetByRoomIdAsync(int roomId)
        {
            return await _context.Furniture
                .Where(f => f.RoomId == roomId)
                .Include(f => f.PriceComparisons)
                .ToListAsync();
        }

        public async Task<Furniture> CreateAsync(Furniture furniture)
        {


            _context.Furniture.Add(furniture);
            await _context.SaveChangesAsync();

            return furniture;
        }

        public async Task<Furniture> UpdateAsync(Furniture furniture)
        {

            _context.Furniture.Update(furniture);
            await _context.SaveChangesAsync();

            return furniture;
        }

        public async Task<bool> DeleteAsync(int furnitureId)
        {
            var furniture = await _context.Furniture.FindAsync(furnitureId);
            if (furniture == null)
                return false;

            _context.Furniture.Remove(furniture);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}



