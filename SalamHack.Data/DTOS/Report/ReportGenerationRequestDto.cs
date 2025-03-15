using System.ComponentModel.DataAnnotations;


namespace SalamHack.Data.DTOS.Report
{
    public class ReportGenerationRequestDto
    {
        [Required]
        public int ProjectId { get; set; }

        // إذا كان المستخدم يريد إضافة ملاحظات خاصة في التقرير
        public string AdditionalNotes { get; set; }
    }
}


