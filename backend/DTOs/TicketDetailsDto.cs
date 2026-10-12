using backend.Models;

namespace backend.DTOs;
public class TicketDetailsDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Priority { get; set; } = string.Empty;

    public string Tags { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
    public DateTime? ClosedAt { get; set; }

    public int CurrentUserId { get; set; }

    public int? AuthorId { get; set; }

    public string Author { get; set; } = string.Empty;

    public List<TicketCommentDto> Comments { get; set; } = new();

    public List<TicketInternalCommentDto> InternalComments { get; set; } = new();
}