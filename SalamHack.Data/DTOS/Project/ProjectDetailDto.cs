using SalamHack.Data.DTOS.Layout;
using SalamHack.Data.DTOS.Report;
using SalamHack.Data.DTOS.Room;

namespace SalamHack.Data.DTOS.Project
{
    public class ProjectDetailDto
    {
        public int ProjectId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; }
        public decimal Budget { get; set; }
        public string HomeSize { get; set; }
        public int RoomCount { get; set; }
        public string Location { get; set; }
        public string StylePreference { get; set; }
        public List<RoomDto> Rooms { get; set; }
        public List<LayoutSummaryDto> Layouts { get; set; }
        public LayoutDto CurrentLayout { get; set; }
        public ReportSummaryDto LatestReport { get; set; }
    }
}


