using Microsoft.AspNetCore.Mvc;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly static List<Tickets> Tickets = new();

    [HttpGet]
    public ActionResult<List<Tickets>> GetAll()
    {
        return Ok(Tickets);
    }

    [HttpGet("{id}")]
    public ActionResult<Tickets> GetById(int id)
    {
        var ticket = Tickets.FirstOrDefault(t => t.Id == id);
        if (ticket == null)
        {
            return NotFound();
        }
        return Ok(ticket);
    }

    [HttpPost]
    public ActionResult<Tickets> Create(Tickets ticket)
    {
        ticket.Id = Tickets.Count + 1;
        Tickets.Add(ticket);
        return CreatedAtAction(nameof(GetById), new { id = ticket.Id }, ticket);
    }
    
}