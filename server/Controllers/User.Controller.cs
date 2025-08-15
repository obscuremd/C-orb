using Microsoft.AspNetCore.Mvc;
using server.Models;

namespace server
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UserController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDTO user)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingUser = _context.Users.FirstOrDefault(u => u.Id == user.Id);

            if (existingUser != null)
                return BadRequest(new { message = "User Already exists" });

            var newUser = new User
            {
                Id = user.Id,
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

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User Created Successfully" });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser([FromQuery] string id)
        {
            if (string.IsNullOrEmpty(id))
                return BadRequest(new { message = "id not found" });

            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return BadRequest(new { message = " User not found" });

            return Ok(new { message = "User Found", user });
        }
    };
    
}