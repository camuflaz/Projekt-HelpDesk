using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
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
            
            Response.Cookies.Append("access_token", Token, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddHours(3)
            });

        /*return Ok(new { Message = "Zalogowano pomyślnie.", Token, Userid = user.Id, Username = user.Username, Role = user.Role });
        } stara wersja*/

        return Ok(new
        {
            id = user.Id, Username = user.Username, Role = user.Role
        });

        
        }
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var username = User.FindFirst(ClaimTypes.Name)?.Value;

        var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                id = userId,
                username = username,
                role = role
            });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete(
                "access_token"
            );

            return Ok(new
            {
                message = "Wylogowano"
            });
        }
    }
}
