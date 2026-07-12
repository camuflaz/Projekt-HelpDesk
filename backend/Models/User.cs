namespace backend.Models;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;
    public string Password_hash { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;

    public ICollection<Ticket> CreatedTickets { get; set; } = new List<Ticket>();

    public ICollection<Ticket> AssignedTickets { get; set; } = new List<Ticket>(); 

    public ICollection<TicketComment> Comments { get; set;} = new List<TicketComment>();

}