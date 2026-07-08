using backend.DTOs;
using backend.Models;

namespace backend.Services;

public interface ITicketService
{
    Task<Ticket> CreateTicketAsync(
        CreateTicketDto dto,
        int authorId
    );
}