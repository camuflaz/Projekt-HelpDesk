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
            .Where(t => t.AuthorId == userId && (t.Status == "closed" || t.Status == "resolved"))
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


    public async Task<TicketDetailsDto?> GetTicketDetailsAsync(
        int ticketId,
        int userId)
    {
        var ticket = await _context.Tickets

        .Include(t => t.Comments)
        .ThenInclude(c => c.User)
        .FirstOrDefaultAsync(t=>
            t.Id == ticketId && 
            t.AuthorId == userId
        );

        if(ticket == null)
        {
            return null;
        }

        return new TicketDetailsDto
        {
            Id = ticket.Id,
            Title = ticket.Title,
            Description = ticket.Description,
            Category = ticket.Category,
            Priority = ticket.Priority,
            Status = ticket.Status,
            CurrentUserId = userId,
            Comments = ticket.Comments
                .OrderBy(c => c.CreatedAt)
                .Select(c => new TicketCommentDto
                {
                    Id = c.Id,
                    Message = c.Message,
                    CreatedAt = c.CreatedAt,
                    UserId = c.UserId,
                    Author = c.User.Username,
                    Role = c.User.Role
                })
                .ToList()
        };
    }

    public async Task AddCommentAsync(
        int ticketId,
        int userId,
        AddCommentDto dto)
    {
        var comment  = new TicketComment
        {
            TicketId = ticketId,
            UserId = userId,
            Message = dto.Message,
            CreatedAt = DateTime.UtcNow
        };

        _context.TicketComments.Add(comment);

        await _context.SaveChangesAsync();
    }


    
}