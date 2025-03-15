using System.ComponentModel.DataAnnotations;


namespace SalamHack.Data.DTOS.Layout
{
    public class LayoutGenerationRequestDto
    {
        [Required]
        public int ProjectId { get; set; }

        // إذا كان المستخدم يريد التحكم في المزيد من تفاصيل التصميم
        public string SpecialInstructions { get; set; }
    }
}


