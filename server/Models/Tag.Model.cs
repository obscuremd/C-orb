using server.Models;

namespace server
{
    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public ICollection<User> Users { get; set; } = new List<User>();
        public ICollection<Post> Posts { get; set; } = new List<Post>();
    }
}