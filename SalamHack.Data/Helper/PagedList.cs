using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SalamHack.Data.Helper
{
    public class PagedList<T>
    {
        private PagedList(List<T> items,
                  int page, int pageSize, int totalAccount)
        {
            Items = items;
            Page = page;
            PageSize = pageSize;
            TotalAccount = totalAccount;
        }

        public List<T> Items { get; }
        public int Page { get; }
        public int PageSize { get; }
        public int TotalAccount { get; }
        public int LastPage => TotalAccount / PageSize;
        public bool HasNextPage => Page * Page < TotalAccount;
        public bool HasPreviousPage => Page > 1;

        // after prepare the query use it  PagedList<T>.CreateAsync(query, page, PageSize) 

        public static async Task<PagedList<T>> CreateAsync(
            IQueryable<T> query, int Page = 1, int PageSize = 20)
        {
            int TotalCount = await query.CountAsync();

            var items = await query.Skip((Page - 1) * PageSize).Take(PageSize).ToListAsync();

            return new(items, Page, PageSize, TotalCount);
        }
        public static PagedList<T> Create(
          List<T> Items, int Page, int PageSize, int TotalCount)
        {

            List<T> items = Items;

            return new(items, Page, PageSize, TotalCount);
        }

    }
}
