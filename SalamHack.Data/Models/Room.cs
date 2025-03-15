using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

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

        [Required]
        public decimal RoomSize { get; set; } // in square meters

        [Required]
        public decimal RoomBudget { get; set; }

        // Navigation properties
        public virtual Project Project { get; set; }
        public virtual ICollection<Furniture> Furniture { get; set; }
    }
}
