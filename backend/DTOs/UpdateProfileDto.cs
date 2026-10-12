using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class UpdateProfileDto
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    [StringLength(50, MinimumLength = 1)]
    public string? Username { get; set; }

    [EmailAddress]
    [StringLength(50)]
    public string? Email { get; set; }

    [MinLength(8)]
    public string? NewPassword { get; set; }
}
