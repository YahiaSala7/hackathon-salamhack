using System.ComponentModel.DataAnnotations;


namespace SalamHack.Data.DTOS.Furniture
{
    public class FurnitureCreateDto
    {
        [Required]
        public int RoomId { get; set; }

        [Required, StringLength(100)]
        public string Name { get; set; }

        [Required, StringLength(50)]
        public string Category { get; set; }

        [Required]
        [Range(0.01, 1000000)]
        public decimal Price { get; set; }

        [StringLength(500)]
        public string StoreLink { get; set; }
    }
}

