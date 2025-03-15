using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SalamHack.Models
{
    // 5. Layout Entity
    public class Layout
    {
        [Key]
        public int LayoutId { get; set; }

        [ForeignKey("Project")]
        public int ProjectId { get; set; }

        [Required]
        public string LayoutImage { get; set; } // Could be a URL or Base64 string

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsFinal { get; set; } = false;

        // Navigation property
        public virtual Project Project { get; set; }
    }
}
