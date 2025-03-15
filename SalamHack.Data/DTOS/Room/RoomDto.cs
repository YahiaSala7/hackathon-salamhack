using SalamHack.Data.DTOS.Furniture;

namespace SalamHack.Data.DTOS.Room
{
    // DTO للغرف
    public class RoomDto
    {
        public int RoomId { get; set; }
        public int ProjectId { get; set; }
        public string RoomType { get; set; }
        public decimal RoomSize { get; set; }
        public decimal RoomBudget { get; set; }
        public List<FurnitureDto> Furniture { get; set; }
    }
}


