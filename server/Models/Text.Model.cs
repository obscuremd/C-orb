namespace server.Models
{
    public class Conversation
    {
        public int Id { get; set; }

        public string User1Id { get; set; }
        public User User1 { get; set; }

        public string User2Id { get; set; }
        public User User2 { get; set; }

        // collection of messages in a conversation
        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }

    public class Message
    {
        public int Id { get; set; }
        public int ConversationId { get; set; }
        public Conversation Conversation { get; set; }

        public string SenderId { get; set; }
        public User Sender { get; set; }

        public string Content { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
    }
}