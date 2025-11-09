using System.ComponentModel.DataAnnotations;

namespace server
{

public class PostMediaDto
    {
        public string Url { get; set; }
        public string MediaType { get; set; }
    }
public class PostDto
{

    [Required, MinLength(10, ErrorMessage = "Description must be at least 10 characters long")]
    public string Description { get; set; }

    public ICollection<PostMediaDto> Media { get; set; } = new List<PostMediaDto>();

    [Required, MinLength(10, ErrorMessage = "Location must be at least 5 characters long")]
    public string Location { get; set; }
    
    public string PostType { get; set; }
    
    // tags
    public List<int> TagIds { get; set; } = new();
     // ✅ Conditional validation here
    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (PostType?.ToLower() == "post" && (TagIds == null || TagIds.Count < 5))
        {
            yield return new ValidationResult(
                "Please select at least 5 tags for a post",
                new[] { nameof(TagIds) }
            );
        }
    }

}

}