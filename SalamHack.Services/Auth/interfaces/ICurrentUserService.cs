using SalamHack.Data.Entity.Identity;

namespace SalamHack.Services.Auth.interfaces
{
    public interface ICurrentUserService
    {
        public Task<User> GetUserAsync();
        public int GetUserId();
        public Task<List<string>> GetCurrentUserRolesAsync();
    }
}
