using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using SalamHack.Data.Entity.Identity;

namespace SalamHack.Models
{
    // 2. Project Entity
    public class Project
    {
        [Key]
        public int ProjectId { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        public decimal Budget { get; set; }

        [Required, StringLength(20)]
        public string HomeSize { get; set; } // Small, Medium, Large

        [Required]
        public int RoomCount { get; set; }

        [Required, StringLength(200)]
        public string Location { get; set; }

        [Required, StringLength(50)]
        public string StylePreference { get; set; } // Modern, Classic, Minimalist, etc.

        // Navigation properties
        public virtual User User { get; set; }
        public virtual ICollection<Room> Rooms { get; set; }
        public virtual ICollection<Layout> Layouts { get; set; }
        public virtual ICollection<Report> Reports { get; set; }
    }
}
