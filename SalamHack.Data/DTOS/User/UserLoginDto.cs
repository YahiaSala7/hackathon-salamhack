﻿using System.ComponentModel.DataAnnotations;


namespace SalamHack.DTOs
{
    public class UserLoginDto
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}


