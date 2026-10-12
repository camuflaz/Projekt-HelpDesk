using System.Runtime.CompilerServices;

namespace backend.DTOs;

public class TicketCommentDto
{
    public int Id { get; set; }

    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public int? UserId { get; set; }

    public string Author { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;
}