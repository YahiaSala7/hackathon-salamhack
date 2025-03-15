using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SalamHack.Models
{
    // 6. Report Entity
    public class Report
    {
        [Key]
        public int ReportId { get; set; }

        [ForeignKey("Project")]
        public int ProjectId { get; set; }

        [Required, StringLength(500)]
        public string ReportUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [StringLength(1000)]
        public string Summary { get; set; }

        // Navigation property
        public virtual Project Project { get; set; }
    }
}
