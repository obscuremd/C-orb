using System.ComponentModel.DataAnnotations;

namespace server
{
    public class UserLoginDto
    {
        [Required, EmailAddress(ErrorMessage = "invalid email format")]
        public string Email { get; set; }

        [Required, MinLength(8, ErrorMessage = "password must be more than 6 digits")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$",
            ErrorMessage = "Password must contain at least one uppercase, one lowercase, one number, and one special character.")]
        public string Password { get; set; }
    }
}