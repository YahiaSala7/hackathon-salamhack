namespace SalamHack.Data.DTOS.Report
{
    // DTO للتقرير
    public class ReportDto
    {
        public int ReportId { get; set; }
        public int ProjectId { get; set; }
        public string ReportUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Summary { get; set; }
    }
}


