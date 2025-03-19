/*using SalamHack.Data.Entity.Identity;

namespace SalamHack.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<User> GetUserByIdAsync(int userId)
        {
            return await _userRepository.GetByIdAsync(userId);
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _userRepository.GetByEmailAsync(email);
        }

        //public async Task<User> CreateUserAsync(User user, string password)
        //{
        //    // Create a salt and hash the password
        //    user.PasswordHash = HashPassword(password, user.Salt);

        //    return await _userRepository.CreateAsync(user);
        //}

        public async Task<User> UpdateUserAsync(User user)
        {
            return await _userRepository.UpdateAsync(user);
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            return await _userRepository.DeleteAsync(userId);
        }


        private string GenerateSalt()
        {
            return Guid.NewGuid().ToString();
        }

        private string HashPassword(string password, string salt)
        {
            // In a real implementation, use a proper password hashing algorithm like BCrypt
            // This is a simplified example
            return Convert.ToBase64String(
                System.Security.Cryptography.SHA256.Create()
                .ComputeHash(System.Text.Encoding.UTF8.GetBytes(password + salt))
            );
        }
    }
}*/