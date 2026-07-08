using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Services;

public class TicketService : ITicketService
{
    private readonly AppDbContext _context;

    public TicketService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Ticket> CreateTicketAsync(CreateTicketDto dto, int authorId)
    {
        var ticket = new Ticket
        {
            Title = dto.Title,
            Description = dto.Description,
            Category = dto.Category,
            Priority = dto.Priority,
            Tags = dto.Tags,
            Status = "new",
            AuthorId = authorId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        return ticket;
    }
}