namespace backend.Models;

public class Ticket
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

    public int? AuthorId { get; set; }

    public User? Author { get; set; }

    public int? ArchivedUserId { get; set; }

    public ArchivedUser? ArchivedAuthor { get; set; }

    public int? AssignedAdminId { get; set; }

    public User? AssignedAdmin { get; set; }

    public int? ArchivedAssignedAdminId { get; set; }

    public ArchivedUser? ArchivedAssignedAdmin { get; set; }

    public ICollection<TicketComment> Comments { get; set; } = new List<TicketComment>();

    public ICollection<TicketInternalComment> InternalComments { get; set; } = new List<TicketInternalComment>();

}