using System.ComponentModel.DataAnnotations;

namespace server
{
    public class UserRegistrationDTO
    {

        // username
        [Required]
        [MinLength(5, ErrorMessage = "Username cannot be shorter than 5 characters.")]
        public string Username { get; set; }

        // email
        [Required]
        [MinLength(5, ErrorMessage = "Email cannot be shorter than 5 characters."),EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Email { get; set; }

        // password
        [Required]
        [MinLength(6, ErrorMessage = "Password must not be less than 6 digits")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$",
            ErrorMessage = "Password must contain at least one uppercase, one lowercase, one number, and one special character.")]
        public string Password{ get; set; }

        // phone number
        [Required]
        [MinLength(5, ErrorMessage = "Phone number cannot be shorter than 5 characters."),Phone(ErrorMessage = "Invalid phone number.")]
        [RegularExpression(@"^\+?[1-9]\d{1,14}$", ErrorMessage = "Invalid phone number format.")]
        public string PhoneNumber { get; set; }

        // profile picture
        [Url(ErrorMessage = "Invalid URL format for profile picture.")]
        public string ProfilePicture { get; set; }

        // cover picture
        [Url(ErrorMessage = "Invalid URL format for cover picture.")]
        public string CoverPicture { get; set; }

        // bio
        [MaxLength(500, ErrorMessage = "Bio cannot be longer than 500 characters"), MinLength(5, ErrorMessage = "Bio cannot be shorter than 5 characters.")]
        public string Bio { get; set; }

        // tags
        [MinCount(5, ErrorMessage = "Please Select at least 5 Tags")]
        public List<int> TagIds { get; set; } = new();

        // location
        [Required]
        public string Location { get; set; }

        // badge points
        [Range(0, int.MaxValue, ErrorMessage = "Badge points cannot be negative")]
        public int BadgePoints { get; set; } = 0;
        
    }
}