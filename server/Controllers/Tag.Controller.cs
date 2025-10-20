using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server
{
    [ApiController]
    [Route("api/[controller]")]
    public class TagController : ControllerBase
    {
        public readonly AppDbContext _context;
        public TagController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("tags")]
        public async Task<IActionResult> GetTags()
        {
            var tags = await _context.Tags.OrderBy(t => t.Name).ToListAsync();

            return Ok(new { message = "tags found", tags });
        }
    }
}