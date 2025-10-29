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
    public class SocialController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SocialController(AppDbContext context)
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
        public async Task<IActionResult> GetPosts(
            [FromQuery] string param,
            [FromQuery] int limit = 10,
            [FromQuery] int page = 1)
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
            else if (param == "feed")
            {
                var userTagIds = user.Tags.Select(t => t.Id).ToList();
                var watchPostIds = user.WatchHistory.Select(w => w.PostId).ToList();

                query = query.Where(p => p.Tags.Any(t => userTagIds.Contains(t.Id) && !watchPostIds.Contains(p.Id)));
            }
            // case 4: watch History
            else if (param == "history")
            {
                var watchPostIds = user.WatchHistory.Select(h => h.PostId).ToList();
                query = query.Where(p => watchPostIds.Contains(p.Id));
            }
            // case 5: return all posts sorted by date
            else if (param == "all")
            {
                // no where filter — just apply sorting below
            }

            var skip = (page - 1) * limit;
            var posts = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip(skip)
                .Take(limit)
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

            var totalPosts = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalPosts / (double)limit);

            if (posts == null || posts.Count == 0)
                return BadRequest(new { message = "posts not found" });

            return Ok(new { message = "posts found",page, totalPages, totalPosts, posts });
        }

        [Authorize]
        [HttpPost("bulk-update")]
        public async Task<IActionResult> BulkUpdate([FromBody] List<int> viewedPostIds)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "invalid Token" });

            var now = DateTime.UtcNow;
            var existing = _context.Histories.Where(h => h.UserId == userId && viewedPostIds.Contains(h.PostId));

            var newHistories = new List<History>();
            foreach (var postId in viewedPostIds)
            {
                // ✅ 1. Check if the post already exists in their watch history
                if (!existing.Any(h => h.PostId == postId))
                {
                    // ❌ It doesn’t exist → this is a *new view*
                    // ➜ We create a new History record
                    newHistories.Add(new History
                    {
                        UserId = userId,
                        PostId = postId,
                        Liked = false,
                        ViewedAt = now
                    });
                }
                else
                {
                    // ✅ It already exists → just update its timestamp
                    var history = existing.First(h => h.PostId == postId);
                    history.ViewedAt = now;
                }
            }

            if (newHistories.Any())
                await _context.Histories.AddRangeAsync(newHistories);

            await _context.SaveChangesAsync();

            return Ok(new { message = "History Updated Successfully" });
        }

        [Authorize]
        [HttpPut("like/{postId}")]
        public async Task<IActionResult> LikePost(int postId, [FromBody] bool liked)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid Token" });

            var history =await  _context.Histories.FirstOrDefaultAsync(h => h.UserId == userId && h.PostId == postId);

            if (history == null)
            {
                var newHistory = new History
                {
                    PostId = postId,
                    UserId = userId,
                    Liked = liked,
                    ViewedAt = DateTime.UtcNow
                };
                _context.Histories.Add(newHistory);

            }
            else
            {
                history.Liked = liked;
                history.ViewedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = liked ? "Post liked" : "Like removed" });
        }
    }
}