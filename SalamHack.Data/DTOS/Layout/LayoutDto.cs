namespace SalamHack.Data.DTOS.Layout
{
    // DTO للتصميم
    public class LayoutDto
    {
        public int LayoutId { get; set; }
        public int ProjectId { get; set; }
        public string LayoutImage { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsFinal { get; set; }
    }
}


