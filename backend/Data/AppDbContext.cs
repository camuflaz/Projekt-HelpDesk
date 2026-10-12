using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<ArchivedUser> ArchivedUsers { get; set; }
    public DbSet<Ticket> Tickets { get; set; }

    public DbSet<TicketComment> TicketComments { get; set; }

    public DbSet<TicketInternalComment> TicketInternalComments { get; set; }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.Author)
            .WithMany(u => u.CreatedTickets)
            .HasForeignKey(t => t.AuthorId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.ArchivedAuthor)
            .WithMany(u => u.CreatedTickets)
            .HasForeignKey(t => t.ArchivedUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.AssignedAdmin)
            .WithMany(u => u.AssignedTickets)
            .HasForeignKey(t => t.AssignedAdminId)
            .OnDelete(DeleteBehavior.SetNull); 

        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.ArchivedAssignedAdmin)
            .WithMany(u => u.AssignedTickets)
            .HasForeignKey(t => t.ArchivedAssignedAdminId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<TicketComment>()
            .HasOne(c => c.Ticket)
            .WithMany(t => t.Comments)
            .HasForeignKey(c => c.TicketId);

        modelBuilder.Entity<TicketComment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<TicketComment>()
            .HasOne(c => c.ArchivedUser)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.ArchivedUserId)
            .OnDelete(DeleteBehavior.Restrict);
    
        modelBuilder.Entity<TicketInternalComment>()
            .HasOne(c => c.Ticket)
            .WithMany(t => t.InternalComments)
            .HasForeignKey(c => c.TicketId);

        modelBuilder.Entity<TicketInternalComment>()
            .HasOne(c => c.User)
            .WithMany(u => u.InternalComments)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<TicketInternalComment>()
            .HasOne(c => c.ArchivedUser)
            .WithMany(u => u.InternalComments)
            .HasForeignKey(c => c.ArchivedUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}