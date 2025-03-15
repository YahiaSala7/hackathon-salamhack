namespace SalamHack.Data.DTOS.Project
{
    // DTO للمشروع
    public class ProjectDto
    {
        public int ProjectId { get; set; }
        public int UserId { get; set; }
        public decimal Budget { get; set; }
        public string HomeSize { get; set; }
        public int RoomCount { get; set; }
        public string Location { get; set; }
        public string StylePreference { get; set; }
    }
}


