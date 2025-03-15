using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SalamHack.Models
{
    // 4. Furniture Entity
    // أثاث
    public class Furniture
    {
        [Key]
        public int FurnitureId { get; set; }

        [ForeignKey("Room")]
        public int RoomId { get; set; }

        [Required, StringLength(100)]
        public string Name { get; set; }

        [Required, StringLength(50)]
        public string Category { get; set; } // Sofa, Bed, Table, etc.

        [Required]
        public decimal Price { get; set; }

        [StringLength(500)]
        public string StoreLink { get; set; }

        // Navigation properties
        public virtual Room Room { get; set; }
        public virtual ICollection<PriceComparison> PriceComparisons { get; set; }
    }
}
