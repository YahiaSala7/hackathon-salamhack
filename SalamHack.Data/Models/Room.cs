using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalamHack.Models
{
    // 3. Room Entity
    public class Room
    {
        [Key]
        public int RoomId { get; set; }

        [ForeignKey("Project")]
        public int ProjectId { get; set; }

        [Required, StringLength(50)]
        public string RoomType { get; set; } // Living Room, Bedroom, Kitchen, etc.
        [Precision(18, 2)]
        [Required]
        public decimal RoomSize { get; set; } // in square meters
        [Precision(18, 2)]
        [Required]
        public decimal RoomBudget { get; set; }

        // Navigation properties
        public virtual Project Project { get; set; }
        public virtual ICollection<Furniture> Furniture { get; set; }
    }
}
