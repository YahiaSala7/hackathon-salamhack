using System.ComponentModel.DataAnnotations;


namespace SalamHack.Data.DTOS.Project
{
    public class ProjectCreateDto
    {
        [Required]
        public decimal Budget { get; set; }

        [Required, StringLength(20)]
        public string HomeSize { get; set; } // Small, Medium, Large

        [Required]
        [Range(1, 20)]
        public int RoomCount { get; set; }

        [Required, StringLength(200)]
        public string Location { get; set; }

        [Required, StringLength(50)]
        public string StylePreference { get; set; } // Modern, Classic, Minimalist, etc.
    }
}


