using backend.DTOs;
using backend.Models;

namespace backend.Services;

public interface ITicketService
{
    Task<Ticket> CreateTicketAsync(
        CreateTicketDto dto,
        int authorId
    );

    Task<List<TicketListDto>> GetMyActiveTickets(int userId);

    Task<List<TicketListDto>> GetMyClosedTickets(int userId);

    Task<List<TicketListDto>> GetMyActiveTicketsAdmin(int adminId);

    Task<List<TicketListDto>> GetMyClosedTicketsAdmin(int adminId);

    Task<List<TicketListDto>> GetOpenTickets();

    Task<bool> AssignTicketToAdminAsync(int ticketId, int adminId);

    Task<TicketDetailsDto?> GetTicketDetailsAsync(
        int ticketId,
        int userId,
        string role
    );

    Task AddCommentAsync(
        int ticketId,
        int userId,
        AddCommentDto dto
    );
}