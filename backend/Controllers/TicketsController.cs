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
            nameof(GetTicketById),
            new { id = ticket.Id },
            ticket
        );
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTicketById(int id)
    {
        return Ok();
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

}