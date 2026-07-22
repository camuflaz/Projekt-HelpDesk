using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Ticket> Tickets { get; set; }

    public DbSet<TicketComment> TicketComments { get; set; }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.Author)
            .WithMany(u => u.CreatedTickets)
            .HasForeignKey(t => t.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.AssignedAdmin)
            .WithMany(u => u.AssignedTickets)
            .HasForeignKey(t => t.AssignedAdminId)
            .OnDelete(DeleteBehavior.SetNull); 

        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<TicketComment>()
            .HasOne(c => c.Ticket)
            .WithMany(t => t.Comments)
            .HasForeignKey(c => c.TicketId);

        modelBuilder.Entity<TicketComment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId);

    }
}