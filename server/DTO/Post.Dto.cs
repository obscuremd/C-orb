using System.ComponentModel.DataAnnotations;

namespace server
{
public class PostDto
{

    [Required, MinLength(10, ErrorMessage = "Description must be at least 10 characters long")]
    public string Description { get; set; }

    public string PostUrl { get; set; }

    [Required, MinLength(10, ErrorMessage = "Location must be at least 5 characters long")]
    public string Location { get; set; }
    
    // tags
    [MinCount(5, ErrorMessage = "Please Select at least 5 Tags")]
    public List<int> TagIds { get; set; } = new();

}

}