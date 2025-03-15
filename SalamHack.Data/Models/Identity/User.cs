using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EntityFrameworkCore.EncryptColumn.Attribute;
using SalamHack.Models;


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
