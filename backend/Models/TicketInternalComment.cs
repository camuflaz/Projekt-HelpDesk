using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class TicketInternalComment
{
    public int Id { get; set; }

    [Required]
    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int TicketId { get; set; } 

    public Ticket Ticket { get; set; } = null!;

    public int UserId { get; set; }

    public User User { get; set; } = null!;

}