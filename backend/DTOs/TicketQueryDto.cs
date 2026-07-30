namespace backend.DTOs;

public class TicketQueryDto
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;

    public string? Search { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public string? Category { get; set; }
    public string? Tag { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
}