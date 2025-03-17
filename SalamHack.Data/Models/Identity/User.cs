using EntityFrameworkCore.EncryptColumn.Attribute;
using Microsoft.AspNetCore.Identity;
using SalamHack.Models;
using System.ComponentModel.DataAnnotations.Schema;


namespace SalamHack.Data.Entity.Identity
{
    public class User : IdentityUser<int>
    {

        public string UserName { get; set; }
        public string Name { get; set; }
        public string? Address { get; set; }
        public string? Country { get; set; }

        [EncryptColumn]
        public string? Code { get; set; }
        public virtual ICollection<Project> Projects { get; set; }


        [InverseProperty(nameof(UserRefreshToken.User))]
        public virtual ICollection<UserRefreshToken> UserRefreshTokens { get; set; }
    }
}
