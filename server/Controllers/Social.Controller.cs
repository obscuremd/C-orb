using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server
{
    [ApiController]
    [Route("api/[controller]")]
    public class PostController : ControllerBase
    {
        private readonly AppDbContext _context;
        public PostController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost("create-post")]
        public async Task<IActionResult> CreatePost([FromBody] PostDto postDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                        ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "invalidToken" });

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return BadRequest(new { message = "user not found" });

            var selectedTags = await _context.Tags.Where(t => postDto.TagIds.Contains(t.Id)).ToListAsync();

            var newPost = new Post
            {
                Description = postDto.Description,
                PostUrl = postDto.PostUrl,
                Location = postDto.Location,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                UserId = userId,
                User = user,
                Tags = selectedTags
            };

            await _context.Posts.AddAsync(newPost);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Post Created Successfully",
                post = new
                {
                    newPost.Id,
                    newPost.Description,
                    newPost.PostUrl,
                    newPost.Location,
                    newPost.CreatedAt,
                    newPost.UserId
                }
            });
        }

        [Authorize]
        [HttpGet("get-posts")]
        public async Task<IActionResult> GetPosts([FromQuery] string param)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                        ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "invalid Token" });

            var user = await _context.Users.Include(u => u.WatchHistory).Include(u => u.Tags).FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return BadRequest(new { message = "user not found" });

            var query = _context.Posts
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.Engagement)
                .AsQueryable();

            // case 1: logged users posts
            if (param == "mine")
            {
                query = query.Where(p => p.UserId == userId);
            }
            // case 2: another users posts
            else if (param.StartsWith("user:"))
            {
                var targetUserId = param.Split(":")[1];
                query = query.Where(p => p.UserId == targetUserId);
            }
            // case 3: feed posts
            else if(param == "feed")
            {
                var userTagIds = user.Tags.Select(t => t.Id).ToList();
                var watchPostIds = user.WatchHistory.Select(w => w.PostId).ToList();

                query = query.Where(p => p.Tags.Any(t => userTagIds.Contains(t.Id) && !watchPostIds.Contains(p.Id)));
            }
            var posts = await query
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    User = new
                    {
                        p.User.Username,
                        p.User.ProfilePicture
                    },
                    p.Id,
                    p.Description,
                    p.PostUrl,
                    p.Location,
                    p.CreatedAt,
                    commentCount = p.Comments.Count(),
                    likeCount = p.Engagement.Where(e => e.Liked == true).Count(),
                    views = p.UserId == userId ? p.Engagement.Count() : (int?)null,
                }).ToListAsync();

            if (posts == null || posts.Count == 0)
                return BadRequest(new { message = "posts not found" });

            return Ok(new { message = "posts found", posts });
        }
    }
}