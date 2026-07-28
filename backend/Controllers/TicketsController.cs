using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;
using backend.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.TagHelpers;

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

    [Authorize(Roles = "admin")]
    [HttpGet("my-active-admin")]
    public async Task<IActionResult> GetMyActiveTicketsAdmin()
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var tickets = await _ticketService.GetMyActiveTicketsAdmin(adminId);

        return Ok(tickets);
    }

    [Authorize(Roles = "admin")]
    [HttpGet("my-closed-admin")]
    public async Task<IActionResult> GetMyClosedTicketsAdmin()
    {
        var adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var tickets = await _ticketService.GetMyClosedTicketsAdmin(adminId);

        return Ok(tickets);
    }

    [Authorize(Roles = "admin")]
    [HttpGet("open-tickets")]
    public async Task<IActionResult> GetOpenTickets()
    {
        var tickets = await _ticketService.GetOpenTickets();

        return Ok(tickets);
    }

    [Authorize(Roles = "admin")]
    [HttpPost("{id}/assign")]
    public async Task<IActionResult> AssignTicket(int id)
    {
        int adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var success = await _ticketService.AssignTicketToAdminAsync(id, adminId);

        if (!success)
        {
            return NotFound();
        }

        return Ok(new { success = true });
    }

    [Authorize(Roles = "admin")]
    [HttpGet("get-tickets-w-new-comments")]
    public async Task<IActionResult> GetTicketwNewComment()
    {
        int adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var tickets = await _ticketService.GetTicketwNewComment(adminId);

        return Ok(tickets);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTicket(int id)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var role = User.FindFirst(ClaimTypes.Role)!.Value;

        var ticket = await _ticketService.GetTicketDetailsAsync(id, userId, role);

        if (ticket == null)
        {
            return NotFound();
        }

        return Ok(ticket);
    }


    [Authorize(Roles = "admin")]
    [HttpGet("admin-statistics")]
    public async Task<IActionResult> GetAdminStatistics()
    {
        int adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var statistics = await _ticketService.GetAdminStatisticsAsync(adminId);

        return Ok(statistics);
    }

    [Authorize(Roles = "admin")]
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateTicketStatus(int id, UpdateTicketDto dto)
    {
        int adminId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var success = await _ticketService.UpdateTicketStatusAsync(id, adminId, dto.Status);

        if (!success)
        {
            return BadRequest(new { success = false, message = "Nie można zaktualizować statusu zgłoszenia." });
        }

        return Ok(new { success = true });
    }

    [HttpPost("{id}/comments")]
    public async Task<IActionResult> AddComment(int id, AddCommentDto dto)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        await _ticketService.AddCommentAsync(id, userId, dto);

        return Ok();
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetTickets([FromQuery] TicketQueryDto query)
    {
        int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        string role = User.FindFirst(ClaimTypes.Role)!.Value;

        var result = await _ticketService.GetTicketsAsync(query, userId, role);

        return Ok(result);
    }

}