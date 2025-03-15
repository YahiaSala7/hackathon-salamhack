using System.ComponentModel.DataAnnotations;


namespace SalamHack.Data.DTOS.PriceComparison
{
    // DTOs لنتائج البحث عن الأسعار
    public class PriceSearchRequestDto
    {
        [Required]
        public int ProjectId { get; set; }

        public int? FurnitureId { get; set; } // اختياري - إذا كان نريد البحث عن قطعة أثاث محددة

        [Required]
        public string Location { get; set; } // موقع المستخدم للبحث عن المتاجر القريبة

        public int RadiusKm { get; set; } = 20; // نطاق البحث الافتراضي 20 كم
    }
}


