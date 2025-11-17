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
        private readonly MailService _mailService;
        public UserController(AppDbContext context, IDistributedCache cache, MailService mailService)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<User>();
            _cache = cache;
            _mailService = mailService;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] UserLoginDto user)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string email = user.Email.ToLower();

            var ExistingOtp = _context.Otps.FirstOrDefault(u => u.Email == email);
            if (ExistingOtp != null)
            {
                _context.Otps.Remove(ExistingOtp);
                await _context.SaveChangesAsync();
            }

            var dbUser = _context.Users.FirstOrDefault(u => u.Email == email);
            if (dbUser != null)
            {
                var result = _passwordHasher.VerifyHashedPassword(dbUser, dbUser.Password, user.Password);
                if (result != PasswordVerificationResult.Success)
                    return BadRequest(new { message = "password mismatch" });
            }

            var otpCode = new Random().Next(100000, 999999);
            var subject = "Your Login code is:";
            var body = $"Hello {email}, \n\nYour Otp Code is: {otpCode}\nThis code will expire in 5 minutes.";

            await _mailService.SendEmailAsync(email, subject, body);

            var Otp = new Otp
            {
                Email = email,
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

            string email = user.Email.ToLower();

            var UserOtp = await _context.Otps.FirstOrDefaultAsync(u => u.Email == email);
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

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
                return Ok(new { message = "otp verification successfull", hasAccount = false });

            var token = jwtService.GenerateToken(existingUser);

            return Ok(new
            {
                message = "otp verification successfull",
                hasAccount = true,
                token
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegistrationDTO user, JwtService jwtService)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string email = user.Email.ToLower();
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == email);

            if (existingUser != null)
                return BadRequest(new { message = "User Already exists" });

            // Generate Clerk-like ID
            string customId = $"C_orb_user_{Guid.NewGuid().ToString("N").Substring(0, 26)}";

            // Fetch the tags from the DB
            var selectedTags = await _context.Tags
                .Where(t => user.TagIds.Contains(t.Id))
                .ToListAsync();

            var newUser = new User
            {
                Id = customId,
                Username = user.Username,
                Fullname = user.Fullname,
                Email = email,
                PhoneNumber = user.PhoneNumber,
                ProfilePicture = user.ProfilePicture,
                CoverPicture = user.CoverPicture,
                Bio = user.Bio,
                Location = user.Location,
                BadgePoints = 0,
                Tags = selectedTags,
                CreatedAt = DateTime.UtcNow
            };

            newUser.Password = _passwordHasher.HashPassword(newUser, user.Password);

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            var token = jwtService.GenerateToken(newUser);

            return Ok(new { message = "User Created Successfully", token });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid token" });

            var user = await _context.Users.Include(u => u.Tags).Include(u => u.Posts).FirstOrDefaultAsync(u =>u.Id == userId);

            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(new
            {
                message = "User Found",
                user = new
                {
                    user.Id,
                    user.Username,
                    user.Fullname,
                    user.Email,
                    user.PhoneNumber,
                    user.ProfilePicture,
                    user.CoverPicture,
                    user.Bio,
                    user.Location,
                    user.BadgePoints,
                    user.CreatedAt,
                    Tags = user.Tags.Select(t => new   // 👈 flatten tags
                    {
                        t.Id,
                        t.Name
                    }),
                    postCount = user.Posts.Count(),
                    followersCount = user.Followers.Count(),
                    followingCount = user.Following.Count()
                }
            });
        }

        [Authorize]
        [HttpGet("get/{type}")]
        public async Task<IActionResult> GetUserParams(string type, [FromQuery] string queryUserId, [FromQuery] int page = 1, [FromQuery] int limit = 20)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "invalid token" });

            var user = await _context.Users
                        .Include(u => u.Followers)
                        .Include(u => u.Following)
                        .Include(u => u.WatchHistory)
                        .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { message = "user not found" });

            // pagination calculation
            var skip = (page - 1) * limit;


            if (queryUserId != userId)
            {
                var requestedUser = await _context.Users.Include(u => u.Followers).Include(u => u.Following).FirstOrDefaultAsync(u => u.Id == queryUserId);
                if (requestedUser == null)
                    return NotFound(new { message = "Requested User not found" });

                if(type == "user")
                {
                    return Ok(new
                    {
                        message = $"user {requestedUser.Username} found",
                        reqUser = new
                        {
                            requestedUser.Id,
                            requestedUser.Username,
                            requestedUser.Fullname,
                            requestedUser.Email,
                            requestedUser.PhoneNumber,
                            requestedUser.ProfilePicture,
                            requestedUser.CoverPicture,
                            requestedUser.Bio,
                            requestedUser.Location,
                            requestedUser.BadgePoints,
                            requestedUser.CreatedAt,
                            // Tags = requestedUser.Tags.Select(t => new   // 👈 flatten tags
                            // {
                            //     t.Id,
                            //     t.Name
                            // }),
                            postCount = requestedUser.Posts.Count(),
                            followersCount = requestedUser.Followers.Count(),
                            followingCount = requestedUser.Following.Count()
                        }
                    });
                }

                else if (type == "followings")
                    return Ok(new
                    {
                        message = $"user {requestedUser.Username} followings found",
                        totalFollowing = requestedUser.Following.Count,
                        page,
                        totalPages = (int)Math.Ceiling(requestedUser.Following.Count / (double)limit),
                        users = requestedUser.Following.Skip(skip).Take(limit).Select(u => new
                        {
                            u.Id,
                            u.Fullname,
                            u.Username,
                            u.ProfilePicture,
                            following = user.Following.Any(f => f.Id == u.Id)
                        })
                    });
                else if (type == "followers")
                    return Ok(new
                    {
                        message = $"user {requestedUser.Username} followers found",
                        totalFollowers = requestedUser.Followers.Count,
                        page,
                        totalPages = (int)Math.Ceiling(requestedUser.Followers.Count / (double)limit),
                        users = requestedUser.Followers.Skip(skip).Take(limit).Select(u => new
                        {
                            u.Id,
                            u.Fullname,
                            u.Username,
                            u.ProfilePicture,
                            following = user.Following.Any(f => f.Id == u.Id)
                        })
                    });
                else
                {
                    return BadRequest(new { message = "Please input a valid param (followers or followings)" });
                }
            }

            else if (type == "followings")
                return Ok(new
                {
                    message = $"your followings found",
                    totalFollowing = user.Following.Count,
                    page,
                    totalPages = (int)Math.Ceiling(user.Following.Count / (double)limit),
                    users = user.Following.Skip(skip).Take(limit).Select(u => new
                    {
                        u.Id,
                        u.Fullname,
                        u.Username,
                        u.ProfilePicture,
                        following = user.Following.Any(f => f.Id == u.Id)
                    })
                });
            else if (type == "followers")
                return Ok(new
                {
                    message = $"your followers found",
                    totalFollowers = user.Followers.Count,
                    page,
                    totalPages = (int)Math.Ceiling(user.Followers.Count / (double)limit),
                    users = user.Followers.Skip(skip).Take(limit).Select(u => new
                    {
                        u.Id,
                        u.Fullname,
                        u.Username,
                        u.ProfilePicture,
                        following = user.Following.Any(f => f.Id == u.Id)
                    })
                });
            else if (type == "chats")
            {
                var conversations = await _context.Conversations
                                    .Include(c => c.Messages)
                                    .Include(c => c.User1)
                                    .Include(c => c.User2)
                                    .Where(c => c.User1Id == userId || c.User2Id == userId)
                                    .Skip(skip)
                                    .Take(limit)
                                    .ToListAsync();

                var chatResults = conversations.Select(c =>
                {
                    var otherUser = c.User1Id == userId ? c.User2 : c.User1;
                    var latestMessage = c.Messages.OrderByDescending(m => m.SentAt).FirstOrDefault();
                    return new
                    {
                        otherUser.Id,
                        otherUser.ProfilePicture,
                        otherUser.Fullname,
                        lastMessage = latestMessage.Content,
                        sentAt = latestMessage.SentAt,
                        isRead = latestMessage.IsRead

                    };
                });
                return Ok(new
                {
                    message = "Chats found",
                    page,
                    totalPages = (int)Math.Ceiling(user.Conversations.Count / (double)limit),
                    chats = chatResults
                });
            }

            else if (type == "watchHistory")
            {
                var watchHistory = user.WatchHistory.OrderByDescending(h => h.ViewedAt)
                                    .Take(limit)
                                    .Skip(skip)
                                    .ToList();
                var PostIds = watchHistory.Select(w => w.PostId).ToList();

                var post = _context.Posts.Where(p => PostIds.Contains(p.Id))
                            .Include(p => p.User)
                            .Include(p => p.Media);

                var orderedPosts = watchHistory.Join(
                    post,

                    wh => wh.PostId,

                    p => p.Id,

                    (wh, p) => new
                    {
                        p.Id,
                        p.User.Username,
                        p.User.ProfilePicture,
                        Media = p.Media.Select(m => new { m.Url, m.MediaType }),
                        watchedAt = wh.ViewedAt
                    }
                );

                return Ok(new
                {
                    message = "Watch history found",
                    totalWatched = user.WatchHistory.Count,
                    posts = orderedPosts,
                    page,
                    totalPages = (int)Math.Ceiling(user.WatchHistory.Count / (double)limit)
                });
                            
            }
            else return BadRequest(new { message = "Error" });
        }

        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UserUpdateDTO updateUser)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Invalid Token" });

            var user = await _context.Users.Include(u => u.Tags).FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound(new { message = "user not found" });

            // Update fields if they are provided
            if (!string.IsNullOrEmpty(updateUser.Username)) user.Username = updateUser.Username;
            if (!string.IsNullOrEmpty(updateUser.ProfilePicture)) user.ProfilePicture = updateUser.ProfilePicture;
            if (!string.IsNullOrEmpty(updateUser.CoverPicture)) user.CoverPicture = updateUser.CoverPicture;
            if (!string.IsNullOrEmpty(updateUser.Bio)) user.Bio = updateUser.Bio;
            if (!string.IsNullOrEmpty(updateUser.Location)) user.Location = updateUser.Location;
            if (!string.IsNullOrEmpty(updateUser.Website)) user.Website = updateUser.Website;

            // Update tags if provided
            if (updateUser.TagIds != null && updateUser.TagIds.Count > 0)
            {
                var tags = await _context.Tags
                    .Where(t => updateUser.TagIds.Contains(t.Id))
                    .ToListAsync();
                user.Tags = tags;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "user Updated", user });
        }

        [Authorize]
        [HttpPut("follow-user/{secondaryUserId}")]
        public async Task<IActionResult> FollowUser(string secondaryUserId)
        {
            var primaryUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(primaryUserId))
                return Unauthorized(new { message = "Invalid Token" });

            var PrimaryUser = await _context.Users.Include(u => u.Following).FirstOrDefaultAsync(u => u.Id == primaryUserId);
            var SecondaryUser = await _context.Users.Include(u => u.Followers).FirstOrDefaultAsync(u => u.Id == secondaryUserId);
            if (PrimaryUser == null || SecondaryUser == null)
                return NotFound(new { message = "users not found" });

            if (PrimaryUser.Following.Any(u => u.Id == secondaryUserId))
            {
                PrimaryUser.Following.Remove(SecondaryUser);
                SecondaryUser.Followers.Remove(PrimaryUser);
                await _context.SaveChangesAsync();
                return Ok(new { message = "user unfollowed Successfully", follow = false });
            }
            else
            {
                PrimaryUser.Following.Add(SecondaryUser);
                SecondaryUser.Followers.Add(PrimaryUser);
                await _context.SaveChangesAsync();
                return Ok(new { message = "user followed Successfully", follow = true });
            }
            
        }

    }

        }

    