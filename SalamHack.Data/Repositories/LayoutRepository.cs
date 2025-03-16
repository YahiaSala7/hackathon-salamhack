﻿using Microsoft.EntityFrameworkCore;
using SalamHack.Data.Repositories.Interfaces;
using SalamHack.Models;

namespace SalamHack.Data.Repositories
{
    public class LayoutRepository : ILayoutRepository
    {
        private readonly ApplicationDbContext _context;

        public LayoutRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Layout> GetByIdAsync(int layoutId)
        {
            return await _context.Layouts.FindAsync(layoutId);
        }

        public async Task<List<Layout>> GetByProjectIdAsync(int projectId)
        {
            return await _context.Layouts
                .Where(l => l.ProjectId == projectId)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
        }

        public async Task<Layout> GetCurrentLayoutAsync(int projectId)
        {
            return await _context.Layouts
                .Where(l => l.ProjectId == projectId && l.IsFinal)
                .FirstOrDefaultAsync() ??
                await _context.Layouts
                    .Where(l => l.ProjectId == projectId)
                    .OrderByDescending(l => l.CreatedAt)
                    .FirstOrDefaultAsync();
        }

        public async Task<Layout> CreateAsync(Layout layout)
        {

            _context.Layouts.Add(layout);
            await _context.SaveChangesAsync();

            return layout;
        }

        public async Task<Layout> UpdateAsync(Layout layout)
        {
            _context.Layouts.Update(layout);
            await _context.SaveChangesAsync();

            return layout;
        }

        public async Task<bool> DeleteAsync(int layoutId)
        {
            var layout = await _context.Layouts.FindAsync(layoutId);
            if (layout == null)
                return false;

            _context.Layouts.Remove(layout);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}



