using System.ComponentModel.DataAnnotations;


namespace SalamHack.Data.DTOS.Layout
{
    public class LayoutCreateDto
    {
        [Required]
        public int ProjectId { get; set; }

        [Required]
        public string LayoutImage { get; set; }

        public bool IsFinal { get; set; } = false;
    }
}


