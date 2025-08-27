using System.ComponentModel.DataAnnotations;
using server.Models;

namespace server
{
    public class VerifyOtpDto
    {
        [Required, EmailAddress(ErrorMessage = "invalid email format")]
        public string Email { get; set; }
        [Range(100000, 999999, ErrorMessage = "OTP must be 6 digits")]
        public int Code { get; set; }
    }
}