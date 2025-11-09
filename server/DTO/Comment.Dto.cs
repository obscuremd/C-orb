using System.ComponentModel.DataAnnotations;

namespace server
{
    public class CommentDto
    {
        public int? ParentCommentId { get; set; }

        [Required]
        public string Content{ get; set; }
    }
}