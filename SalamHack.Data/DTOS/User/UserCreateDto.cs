using System.ComponentModel.DataAnnotations;


namespace SalamHack.DTOs
{
    public class UserCreateDto
    {
        [Required, StringLength(50)]
        public string Username { get; set; }

        [Required, StringLength(100), EmailAddress]
        public string Email { get; set; }

        [Required, StringLength(50, MinimumLength = 6)]
        public string Password { get; set; }
    }
}


