using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Title { get; set; }  // Fixed typo
        public string Description { get; set; }
        public string ImageUrl { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        public string Category { get; set; }
        public int Stock { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public decimal Rating { get; set; }
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Review
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public string Content { get; set; }
        
        [Range(1, 5)]
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class Cart
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }

    public class CartItem
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int CartId { get; set; }
        public Cart Cart { get; set; }
        
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; } = 1;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }

    public class WishList
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public ICollection<WishListItem> WishListItems { get; set; } = new List<WishListItem>();
    }

    public class WishListItem
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int WishListId { get; set; }
        public WishList WishList { get; set; }
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
        
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; } = 1;
    }

    public enum PaymentStatus { Pending, Completed, Failed, Refunded }
    public enum OrderStatus { Pending, Processing, Shipped, Delivered, Cancelled }

    public class Order
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }
        
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public DateTime? DeliveryDate { get; set; }
        public string ShippingAddress { get; set; }
        public string PaymentMethod { get; set; }
        public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
        public string TrackingNumber { get; set; }
        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal ShippingCost { get; set; } = 0;
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public DateTime OrderedAt { get; set; } = DateTime.UtcNow;
    }
}