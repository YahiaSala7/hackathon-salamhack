using System.ComponentModel.DataAnnotations;


namespace SalamHack.Data.DTOS.Room
{
    public class RoomCreateDto
    {
        [Required]
        public int ProjectId { get; set; }

        [Required, StringLength(50)]
        public string RoomType { get; set; }

        [Required]
        [Range(1, 1000)]
        public decimal RoomSize { get; set; }

        [Required]
        [Range(1, 1000000)]
        public decimal RoomBudget { get; set; }
    }
}

