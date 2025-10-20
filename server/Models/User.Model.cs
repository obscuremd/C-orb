using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class Otp
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public int Code { get; set; }
        public DateTime SentAt{ get; set; }
    }
    public class User
    {
        public string Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string ProfilePicture { get; set; }
        public string CoverPicture { get; set; }
        public string Bio { get; set; }
        public string Location { get; set; }
        public string? Website { get; set; }
        public int BadgePoints { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Tag> Tags { get; set; } = new List<Tag>();

        // Social Media Relationships
        public ICollection<User> Following { get; set; } = new List<User>();
        public ICollection<Post> Posts { get; set; } = new List<Post>();
        public ICollection<History> WatchHistory { get; set; } = new List<History>();
        public ICollection<Story> Stories { get; set; } = new List<Story>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();

        // Conversation Relationships (split for User1 and User2)
        public ICollection<Conversation> Conversations { get; set; } = new List<Conversation>();

        // E-Commerce Relationships
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<Cart> Carts { get; set; } = new List<Cart>();
        public ICollection<WishList> WishLists { get; set; } = new List<WishList>();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }

    public class History
    {
        public int Id { get; set; }
        // user relations
        public User User { get; set; }
        public string UserId { get; set; }

        // Post relations
        public Post Post { get; set; }
        public int PostId { get; set; }

        // other relations
        public Boolean Liked { get; set; }
        public DateTime ViewedAt { get; set; } 
    }
}