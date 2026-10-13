using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.DTOs;
using backend.Services;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context; 

        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);

        if (user == null)
        {
            return Unauthorized(new{ Message = "Nieprawidłowa nazwa użytkownika lub hasło."});
        }

        bool validPassword = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password_hash);


        if (!validPassword)
        {
            return Unauthorized(new{ Message = "Nieprawidłowa nazwa użytkownika lub hasło."});
        }
        else{
        var Token = 
            _jwtService.GenerateToken(
                user.Id,
                user.Username,
                user.Role
            );
            
            SetAuthCookie(Token);

        /*return Ok(new { Message = "Zalogowano pomyślnie.", Token, Userid = user.Id, Username = user.Username, Role = user.Role });
        } stara wersja*/

        return Ok(new
        {
            id = user.Id, username = user.Username, email = user.Email, role = user.Role
        });

        
        }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> Me()
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new { id = u.Id, username = u.Username, email = u.Email, role = u.Role })
                .FirstOrDefaultAsync();

            return user == null ? Unauthorized() : Ok(user);
        }

        [Authorize]
        [HttpPatch("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            if (dto.Username == null && dto.Email == null && dto.NewPassword == null)
            {
                return BadRequest(new { message = "Nie otrzymano żadnych danych, podaj nazwę użytkownika, mail oraz hasło." });
            }

            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null)
            {
                return Unauthorized();
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.Password_hash))
            {
                return BadRequest(new { message = "Aktualne hasło jest niepoprawne." });
            }

            var newUsername = dto.Username?.Trim();
            var newEmail = dto.Email?.Trim();

            if (dto.Username != null && string.IsNullOrWhiteSpace(newUsername))
            {
                return BadRequest(new { message = "Nazwa użytkownika nie może być pusta." });
            }

            if (dto.Email != null && string.IsNullOrWhiteSpace(newEmail))
            {
                return BadRequest(new { message = "Email nie może być pusty." });
            }

            if (newUsername != null && await _context.Users.AnyAsync(u =>
                    u.Id != user.Id && u.Username == newUsername))
            {
                return Conflict(new { message = "Ta nazwa użytkownika jest już wykorzystywana." });
            }

            if (newEmail != null && await _context.Users.AnyAsync(u =>
                    u.Id != user.Id && u.Email == newEmail))
            {
                return Conflict(new { message = "Ten adres Email jest już wykorzystywany." });
            }

            if (newUsername != null)
            {
                user.Username = newUsername;
            }

            if (newEmail != null)
            {
                user.Email = newEmail;
            }

            if (dto.NewPassword != null)
            {
                user.Password_hash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException exception) when (
                exception.InnerException is PostgresException
                {
                    SqlState: PostgresErrorCodes.UniqueViolation
                })
            {
                return Conflict(new { message = "Ta nazwa użytwkonika lub Email są już wykorzystywane." });
            }

            SetAuthCookie(_jwtService.GenerateToken(user.Id, user.Username, user.Role));
            return Ok(new { id = user.Id, username = user.Username, email = user.Email, role = user.Role });
        }

        [Authorize]
        [HttpDelete("account")]
        public async Task<IActionResult> DeleteAccount(DeleteAccountDto dto)
        {
            var userId = GetUserId();
            if (userId == null)
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null)
            {
                return Unauthorized();
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.Password_hash))
            {
                return BadRequest(new { message = "Hasło nieprawidłowe." });
            }

            await using var transaction = await _context.Database.BeginTransactionAsync();

            var archivedUser = new ArchivedUser
            {
                OriginalUserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                DeletedAt = DateTime.UtcNow
            };
            _context.ArchivedUsers.Add(archivedUser);
            await _context.SaveChangesAsync();

            await _context.Tickets
                .Where(ticket => ticket.AuthorId == user.Id)
                .ExecuteUpdateAsync(update => update
                    .SetProperty(ticket => ticket.AuthorId, (int?)null)
                    .SetProperty(ticket => ticket.ArchivedUserId, archivedUser.Id));

            await _context.Tickets
                .Where(ticket => ticket.AssignedAdminId == user.Id)
                .ExecuteUpdateAsync(update => update
                    .SetProperty(ticket => ticket.AssignedAdminId, (int?)null)
                    .SetProperty(ticket => ticket.ArchivedAssignedAdminId, archivedUser.Id));

            await _context.TicketComments
                .Where(comment => comment.UserId == user.Id)
                .ExecuteUpdateAsync(update => update
                    .SetProperty(comment => comment.UserId, (int?)null)
                    .SetProperty(comment => comment.ArchivedUserId, archivedUser.Id));

            await _context.TicketInternalComments
                .Where(comment => comment.UserId == user.Id)
                .ExecuteUpdateAsync(update => update
                    .SetProperty(comment => comment.UserId, (int?)null)
                    .SetProperty(comment => comment.ArchivedUserId, archivedUser.Id));

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            Response.Cookies.Delete("access_token", new CookieOptions { Path = "/" });
            return Ok(new { message = "Konto zostało usunięte oraz zarchiwizowane." });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("access_token", new CookieOptions { Path = "/" });

            return Ok(new
            {
                message = "Wylogowano"
            });
        }

        private int? GetUserId()
        {
            return int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId)
                ? userId
                : null;
        }

        private void SetAuthCookie(string token)
        {
            Response.Cookies.Append("access_token", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddHours(3),
                Path = "/"
            });
        }
    }
}
