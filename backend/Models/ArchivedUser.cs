namespace backend.Models;

public class ArchivedUser
{
    public int Id { get; set; }
    public int OriginalUserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime DeletedAt { get; set; }

    public ICollection<Ticket> CreatedTickets { get; set; } = new List<Ticket>();

    public ICollection<Ticket> AssignedTickets { get; set; } = new List<Ticket>(); 

    public ICollection<TicketComment> Comments { get; set;} = new List<TicketComment>();

    public ICollection<TicketInternalComment> InternalComments { get; set; } = new List<TicketInternalComment>();
}
