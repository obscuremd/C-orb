using System.ComponentModel.DataAnnotations;

namespace server
{
    public class UserUpdateDTO
    {
        [MinLength(3, ErrorMessage = "Username must be at least 3 characters.")]
        public string? Username { get; set; }

        [Url(ErrorMessage = "Invalid URL for profile picture.")]
        public string? ProfilePicture { get; set; }

        [Url(ErrorMessage = "Invalid URL for cover picture.")]
        public string? CoverPicture { get; set; }

        [MaxLength(500, ErrorMessage = "Bio cannot exceed 500 characters.")]
        public string? Bio { get; set; }

        public string? Location { get; set; }
        public string? Website { get; set; }

        // Optional: allow updating tags
        public List<int>? TagIds { get; set; }
    }
}
