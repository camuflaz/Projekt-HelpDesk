namespace backend.DTOs;

public class TicketStatisticsDto
{
    public int ActiveTickets { get; set; }
    public int NewTicketsAvailable { get; set; }
    public int ResolvedTickets { get; set; }
    public int ClosedTickets { get; set; }
    public string AverageCompletionTime { get; set; } = string.Empty;
}
