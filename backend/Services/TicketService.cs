using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

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

    public async Task<List<TicketListDto>> GetMyActiveTickets(int userId)
    {
        return await _context.Tickets
            .Where (t => t.AuthorId == userId && t.Status != "closed" && t.Status != "resolved")

            .OrderByDescending(t => t.CreatedAt)

            .Take(3)

            .Select(t => new TicketListDto
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                Priority = t.Priority,
                CreatedAt = t.CreatedAt
            })

            .ToListAsync();
    }

    public async Task<List<TicketListDto>> GetMyClosedTickets(int userId)
    {
        return await _context.Tickets
            .Where(t => t.AuthorId == userId && t.Status == "closed" | t.Status == "resolved")
            .OrderByDescending(t => t.CreatedAt)
            .Take(3)
            .Select(t=> new TicketListDto
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                Priority = t.Priority,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();
    }
}