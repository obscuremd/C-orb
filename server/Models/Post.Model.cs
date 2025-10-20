namespace server.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string PostUrl { get; set; }
        public string Location { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Foreign key to user
        public string UserId { get; set; }
        // Navigation property to User
        public User User { get; set; }

        public ICollection<Tag> Tags { get; set; } = new List<Tag>();

        public ICollection<History> Engagement { get; set; } = new List<History>();

        public List<Comment> Comments { get; set; } = new List<Comment>();
    }

    public class Comment
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }

        // User who made the comment
        public string UserId { get; set; }
        public User User { get; set; }

        // polymorphic association - only one of these will be set
        public int? PostId { get; set; }
        public Post Post { get; set; }

        public int? StoryId { get; set; }
        public Story Story { get; set; }

        // self refrencing for replies
        public int? ParentCommentId { get; set; }
        public Comment ParentComment { get; set; }
        public List<Comment> Replies { get; set; } = new List<Comment>();

    }
    
    public class Story
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string StoryUrl { get; set; }
        public string Location { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Foreign key to user
        public string UserId { get; set; }
        // Navigation property to User
        public User User { get; set; } 
        public List<Comment> Comments { get; set; } = new List<Comment>();
    }
}