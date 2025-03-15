using System.ComponentModel.DataAnnotations;


namespace SalamHack.Data.DTOS.PriceComparison
{
    public class PriceComparisonCreateDto
    {
        [Required]
        public int FurnitureId { get; set; }

        [Required, StringLength(100)]
        public string StoreName { get; set; }

        [Required]
        [Range(0.01, 1000000)]
        public decimal Price { get; set; }

        [Required, StringLength(500)]
        public string Url { get; set; }
    }
}


