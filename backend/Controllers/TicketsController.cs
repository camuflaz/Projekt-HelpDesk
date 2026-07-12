using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using backend.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketsController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    
    [HttpPost]
    public async Task<IActionResult> CreateTicket( CreateTicketDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized();
        }

        int userId = int.Parse(userIdClaim.Value);

        if (_ticketService == null)
        {
            return StatusCode(500);
        }

        var ticket = await _ticketService.CreateTicketAsync(dto, userId);

        return CreatedAtAction(
            nameof(GetTicket),
            new { id = ticket.Id },
            ticket
        );
    }

    
    [Authorize]
    [HttpGet("my-active")]
    public async Task<IActionResult> GetMyActiveTickets()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var tickets = await _ticketService.GetMyActiveTickets(userId);

        return Ok(tickets);
    }

    [Authorize]
    [HttpGet("my-closed")]
    public async Task<IActionResult> GetMyClosedTickets()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var tickets = await _ticketService.GetMyClosedTickets(userId);

        return Ok(tickets);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTicket(int id)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var ticket = await _ticketService.GetTicketDetailsAsync(id, userId);

        if (ticket == null)
        {
            return NotFound();
        }

        return Ok(ticket);
    }

    [HttpPost("{id}/comments")]
    public async Task<IActionResult> AddComment(int id, AddCommentDto dto)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        await _ticketService.AddCommentAsync(id, userId, dto);

        return Ok();
    }

}