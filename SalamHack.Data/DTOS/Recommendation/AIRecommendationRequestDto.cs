using System.ComponentModel.DataAnnotations;


namespace SalamHack.Data.DTOS.Recommendation
{
    // DTOs خاصة بالذكاء الاصطناعي
    public class AIRecommendationRequestDto
    {
        [Required]
        public int ProjectId { get; set; }

        public int? RoomId { get; set; } // اختياري - إذا كان نريد توصيات لغرفة محددة
    }
}


