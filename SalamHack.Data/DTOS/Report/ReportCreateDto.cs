using System.ComponentModel.DataAnnotations;


namespace SalamHack.Data.DTOS.Report
{
    public class ReportCreateDto
    {
        [Required]
        public int ProjectId { get; set; }

        [Required, StringLength(500)]
        public string ReportUrl { get; set; }

        [StringLength(1000)]
        public string Summary { get; set; }
    }
}


