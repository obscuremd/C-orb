using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using server.Models;
using Server.Utils;

namespace server
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IDistributedCache _cache;
        public UserController(AppDbContext context, IDistributedCache cache)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
            _cache = cache;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] UserLoginDto user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var dbUser = _context.Users.FirstOrDefault(u => u.Email == user.Email);

            if (dbUser != null )
            {
                var result = _passwordHasher.VerifyHashedPassword(dbUser, dbUser.Password, user.Password);
                if( result != PasswordVerificationResult.Success)
                    return BadRequest(new { message = "password mismatch" });
            }

            var otpCode = new Random().Next(100000, 999999);
            var subject = "Your Login code is:";
            var body = $"Hello {user.Email}, \n\nYour Otp Code is: {otpCode}\nThis code will expire in 5 minutes.";

            var _emailService = new MailService();
            await _emailService.SendEmailAsync(user.Email, subject, body);
            
            var Otp = new Otp
            {
                Email = user.Email,
                Code = otpCode,
                SentAt = DateTime.UtcNow
            };

            _context.Otps.Add(Otp);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Otp has been Sent successfully" });
        }

        [HttpPost("authenticate-verify-otp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto user, JwtService jwtService)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var UserOtp = await _context.Otps.FirstOrDefaultAsync(u => u.Email == user.Email);
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == user.Email);

            if (UserOtp == null)
                return BadRequest(new { message = "otp or user not found" });

            if (user.Code != UserOtp.Code)
                return BadRequest(new { message = "Otp Mismatch" });

            if ((DateTime.UtcNow - UserOtp.SentAt.ToUniversalTime()).TotalMinutes > 5)
            {
                _context.Otps.Remove(UserOtp);
                await _context.SaveChangesAsync();
                return BadRequest(new { message = "Otp expired" });
            }

            _context.Otps.Remove(UserOtp);
            await _context.SaveChangesAsync();

            if (existingUser == null)
                return Ok(new { message = "otp verification successfull", user = false });

            var token = jwtService.GenerateToken(existingUser);

            return Ok(new
            {
                message = "success",
                user = token
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDTO user, JwtService jwtService)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = _context.Users.FirstOrDefault(u => u.Email == user.Email);

            if (existingUser != null)
                return BadRequest(new { message = "User Already exists" });

            // Generate Clerk-like ID
            string customId = $"C_orb_user_{Guid.NewGuid().ToString("N").Substring(0, 26)}";

            var newUser = new User
            {
                Id = customId,
                Username = user.Username,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                ProfilePicture = user.ProfilePicture,
                CoverPicture = user.CoverPicture,
                Bio = user.Bio,
                Location = user.Location,
                BadgePoints = 0,
                CreatedAt = DateTime.UtcNow
            };

            newUser.Password = _passwordHasher.HashPassword(newUser, user.Password);

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var token = jwtService.GenerateToken(newUser);

            return Ok(new { message = "User Created Successfully",token });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetUser()
        {
            // Extract user id (sub) from JWT claims
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
             ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;


            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid token" });


            //try getting user from cache
            // var cachedUserBytes = await _cache.GetAsync(userId);
            // if (cachedUserBytes != null)
            // {
            //     var cachedUser = JsonSerializer.Deserialize<User>(cachedUserBytes);
            //     return Ok(new
            //     {
            //         message = "user found from cache",
            //         user = new
            //         {
            //             cachedUser.Id,
            //             cachedUser.Username,
            //             cachedUser.Email,
            //             cachedUser.PhoneNumber,
            //             cachedUser.ProfilePicture,
            //             cachedUser.CoverPicture,
            //             cachedUser.Bio,
            //             cachedUser.Location,
            //             cachedUser.BadgePoints,
            //             cachedUser.CreatedAt
            //         }
            //     });
            // }

            // find user from database if its not in cache
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound(new { message = "User not found" });

            //serialize and store the user in cache for 5 hours
            // var options = new DistributedCacheEntryOptions
            // {
            //     AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(5)
            // };

            // var userBytes = JsonSerializer.SerializeToUtf8Bytes(user);
            // await _cache.SetAsync(userId, userBytes, options);
            

            return Ok(new
            {
                message = "User Found",
                user = new
                {
                    user.Id,
                    user.Username,
                    user.Email,
                    user.PhoneNumber,
                    user.ProfilePicture,
                    user.CoverPicture,
                    user.Bio,
                    user.Location,
                    user.BadgePoints,
                    user.CreatedAt
                }
            });
        }

    };
    
}