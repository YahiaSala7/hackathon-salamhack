﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalamHack.Models
{
    // 7. PriceComparison Entity
    public class PriceComparison
    {
        [Key]
        public int ComparisonId { get; set; }

        [ForeignKey("Furniture")]
        public int FurnitureId { get; set; }

        [Required, StringLength(100)]
        public string StoreName { get; set; }

        [Required]
        public decimal Price { get; set; }

        [Required, StringLength(500)]
        public string Url { get; set; }
        public DateTime CreatedAt { get; set; }

        // Navigation property
        public virtual Furniture Furniture { get; set; }
    }
}
