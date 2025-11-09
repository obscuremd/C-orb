namespace server.Models
{
    public class Post
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }

        public string PostType { get; set; }
        //expecting post | story

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Foreign key to user
        public string UserId { get; set; }
        // Navigation property to User
        public User User { get; set; }

        public ICollection<Tag> Tags { get; set; } = new List<Tag>();

        public ICollection<History> Engagement { get; set; } = new List<History>();

        public List<Comment> Comments { get; set; } = new List<Comment>();

        public ICollection<PostMedia> Media { get; set; } = new List<PostMedia>();
    }

    public class PostMedia
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string MediaType { get; set; } // e.g.: "image", "video", etc.

        // Foreign key to Post
        public int PostId { get; set; }
        public Post Post { get; set; }
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

        // self refrencing for replies
        public int? ParentCommentId { get; set; }
        public Comment ParentComment { get; set; }
        public List<Comment> Replies { get; set; } = new List<Comment>();

    }
    
    
}