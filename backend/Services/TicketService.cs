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

    private static DateTime NormalizeToUtc(DateTime value)
    {
        return value.Kind switch
        {
            DateTimeKind.Utc => value,
            DateTimeKind.Local => value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
        };
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
            AssignedAdminId = null,
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


            .Select(t => new TicketListDto
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                Priority = t.Priority,
                CreatedAt = t.CreatedAt,
                AssignedAdminId = t.AssignedAdminId
            })

            .ToListAsync();
    }

    public async Task<List<TicketListDto>> GetMyActiveTicketsAdmin(int adminId)
    {
        return await _context.Tickets
            .Where (t => t.AssignedAdminId == adminId && t.Status != "closed" && t.Status != "resolved")

            .OrderByDescending(t => t.UpdatedAt)

            .Select(t => new TicketListDto
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                Priority = t.Priority,
                CreatedAt = t.CreatedAt,
                AssignedAdminId = t.AssignedAdminId
            })

            .ToListAsync();
    }

    public async Task<List<TicketListDto>> GetMyClosedTickets(int userId)
    {
        return await _context.Tickets
            .Where(t => t.AuthorId == userId && (t.Status == "closed" || t.Status == "resolved"))
            .OrderByDescending(t => t.CreatedAt)
            .Select(t=> new TicketListDto
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                Priority = t.Priority,
                CreatedAt = t.CreatedAt,
                AssignedAdminId = t.AssignedAdminId
            })
            .ToListAsync();
    }

    public async Task<List<TicketListDto>> GetMyClosedTicketsAdmin(int adminId)
    {
        return await _context.Tickets
            .Where (t => t.AssignedAdminId == adminId && (t.Status == "closed" || t.Status == "resolved"))

            .OrderByDescending(t => t.UpdatedAt)

            .Select(t => new TicketListDto
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                Priority = t.Priority,
                CreatedAt = t.CreatedAt,
                AssignedAdminId = t.AssignedAdminId
            })

            .ToListAsync();
    }

    
    public async Task<List<TicketListDto>> GetTicketwNewComment(int adminId)
    {
        return await _context.Tickets
            .Where(t => t.AssignedAdminId == adminId && t.Status == "in-progress")
            .Where(t => t.Comments.Any())
            .Where(t => t.Comments
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefault()!.UserId != adminId)
            .OrderByDescending(t => t.UpdatedAt)
            .Select(t => new TicketListDto
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                Priority = t.Priority,
                CreatedAt = t.CreatedAt,
                AssignedAdminId = t.AssignedAdminId
            })
            .ToListAsync();
    }


    public async Task<TicketStatisticsDto> GetAdminStatisticsAsync(int adminId)
    {
        var tickets = await _context.Tickets
            .Where(t => t.AssignedAdminId == adminId || t.AssignedAdminId == null)
            .ToListAsync();

        var activeTickets = tickets.Count(t => t.AssignedAdminId == adminId && t.Status != "closed" && t.Status != "resolved");
        var newTicketsAvailable = tickets.Count(t => t.AssignedAdminId == null && t.Status == "new");
        var resolvedTickets = tickets.Count(t => t.AssignedAdminId == adminId && t.Status == "resolved");
        var closedTickets = tickets.Count(t => t.AssignedAdminId == adminId && t.Status == "closed");

        var completedTickets = tickets
            .Where(t => t.AssignedAdminId == adminId && (t.Status == "closed" || t.Status == "resolved") && t.ClosedAt != null)
            .ToList();

        var averageCompletionMinutes = completedTickets.Count == 0
            ? 0
            : (int)Math.Round(completedTickets.Average(t => (t.ClosedAt!.Value - t.CreatedAt).TotalMinutes));

        var hours = averageCompletionMinutes / 60;
        var minutes = averageCompletionMinutes % 60;

        string GetPolishUnit(int value, string singular, string few, string many)
        {
            if (value == 1)
            {
                return singular;
            }

            if (value % 10 >= 2 && value % 10 <= 4 && (value % 100 < 10 || value % 100 >= 20))
            {
                return few;
            }

            return many;
        }

        var formattedAverageCompletionTime = averageCompletionMinutes == 0
            ? "0 minut"
            : string.Join(" ", new[]
            {
                hours > 0 ? $"{hours} {GetPolishUnit(hours, "godzina", "godziny", "godzin")}" : null,
                minutes > 0 ? $"{minutes} {GetPolishUnit(minutes, "minuta", "minuty", "minut")}" : null
            }.Where(part => part != null));

        return new TicketStatisticsDto
        {
            ActiveTickets = activeTickets,
            NewTicketsAvailable = newTicketsAvailable,
            ResolvedTickets = resolvedTickets,
            ClosedTickets = closedTickets,
            AverageCompletionTime = formattedAverageCompletionTime
        };
    }

    public async Task<List<TicketListDto>> GetOpenTickets()
    {
        return await _context.Tickets
            .Where(t => t.AssignedAdminId == null)

            .OrderByDescending(t => t.UpdatedAt)

            .Take(5)

            .Select(t => new TicketListDto
            {
                Id = t.Id,
                Title = t.Title,
                Status = t.Status,
                Priority = t.Priority,
                CreatedAt = t.CreatedAt,
                AssignedAdminId = t.AssignedAdminId
            })

            .ToListAsync();

    }


    public async Task<bool> AssignTicketToAdminAsync(int ticketId, int adminId)
    {
        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(t => t.Id == ticketId);

        if (ticket == null || ticket.AssignedAdminId != null)
        {
            return false;
        }

        ticket.AssignedAdminId = adminId;
        ticket.Status = "in-progress";
        ticket.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateTicketStatusAsync(int ticketId, int adminId, string status)
    {
        if (status != "resolved" && status != "closed")
        {
            return false;
        }

        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(t => t.Id == ticketId && t.AssignedAdminId == adminId);

        if (ticket == null)
        {
            return false;
        }

        if(status == "resolved" || status == "closed")
        {
            ticket.Status = status;
            ticket.ClosedAt = DateTime.UtcNow;
        }
        else
        {
            ticket.Status = status;
            ticket.UpdatedAt = DateTime.UtcNow;
        }

        

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<TicketDetailsDto?> GetTicketDetailsAsync(
        int ticketId,
        int userId,
        string role)
    {
        Ticket? ticket;

        if (role == "admin")
        {
            ticket = await _context.Tickets
                .Include(t => t.Comments)
                .ThenInclude(c => c.User)
                .Include(t => t.InternalComments)
                .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(t => t.Id == ticketId);
        }
        else
        {
            ticket = await _context.Tickets
                .Include(t => t.Comments)
                .ThenInclude(c => c.User)
                .Include(t => t.InternalComments)
                .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(t =>
                    t.Id == ticketId &&
                    t.AuthorId == userId
                );
        }

        if (ticket == null)
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
            Tags = ticket.Tags,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = ticket.UpdatedAt,
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
                .ToList(),
            InternalComments = role == "admin"
                ? ticket.InternalComments
                .OrderBy(c => c.CreatedAt)
                .Select(c => new TicketInternalCommentDto
                {
                    Id = c.Id,
                    Message = c.Message,
                    CreatedAt = c.CreatedAt,
                    UserId = c.UserId,
                    Author = c.User.Username,
                    Role = c.User.Role
                })
                .ToList()
                : new List<TicketInternalCommentDto>()
        };
    }

    public async Task<bool> AddCommentAsync(
        int ticketId,
        int userId,
        AddCommentDto dto)
    {
        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(t =>
                t.Id == ticketId &&
                (t.AuthorId == userId || t.AssignedAdminId == userId));

        if (ticket == null)
        {
            return false;
        }

        var comment = new TicketComment
        {
            TicketId = ticketId,
            UserId = userId,
            Message = dto.Message,
            CreatedAt = DateTime.UtcNow
        };

        _context.TicketComments.Add(comment);

        await _context.SaveChangesAsync();
        return true;
    }


    public async Task AddInternalCommentAsync(
        int ticketId,
        int userId,
        AddInternalCommentDto dto)
    {
        var comment = new TicketInternalComment
        {
            TicketId = ticketId,
            UserId = userId,
            Message = dto.Message,
            CreatedAt = DateTime.UtcNow
        };
        _context.TicketInternalComments.Add(comment);

        await _context.SaveChangesAsync();
    }
    

    public async Task<TicketPageResultDto> GetTicketsAsync(TicketQueryDto query, int userId, string role)
    {
        IQueryable<Ticket> tickets = _context.Tickets;

        if(role == "user")
        {
            tickets = tickets.Where(t => t.AuthorId == userId);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.ToLower();

            tickets = tickets.Where(t => 
            t.Title.ToLower().Contains(search) || t.Description.ToLower().Contains(search) || t.Tags.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            tickets = tickets.Where(t => t.Status == query.Status);
        }

        if (!string.IsNullOrWhiteSpace(query.Priority))
        {
            tickets = tickets.Where(t => t.Priority == query.Priority);
        }

        if (!string.IsNullOrWhiteSpace(query.Category))
        {
            tickets = tickets.Where(t => t.Category == query.Category);
        }

        if (query.DateFrom.HasValue)
        {
            var fromDate = NormalizeToUtc(query.DateFrom.Value.Date);
            tickets = tickets.Where(t => t.CreatedAt >= fromDate);
        }

        if (query.DateTo.HasValue)
        {
            var toDate = NormalizeToUtc(query.DateTo.Value.Date.AddDays(1).AddTicks(-1));
            tickets = tickets.Where(t => t.CreatedAt <= toDate);
        }

        tickets = tickets
            .OrderBy(t => t.Status == "new" ? 0 :
                          t.Status == "in-progress" ? 1 :
                          t.Status == "resolved" ? 2 : 3)
            .ThenByDescending(t => t.CreatedAt);

        var total = await tickets.CountAsync();

        var items = await tickets
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(t => new TicketListDto
            {
                Id = t.Id,
                Title = t.Title,
                Priority = t.Priority,
                Status = t.Status,
                CreatedAt = t.CreatedAt
            })
            .ToListAsync();

        return new TicketPageResultDto
        {
            Items = items,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalItems = total,
            TotalPages = (int)Math.Ceiling(total / (double)query.PageSize)
        };
    }




    
}