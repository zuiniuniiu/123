using Microsoft.EntityFrameworkCore;
using LibrarySeatReservation.Web.Models.Entities;

namespace LibrarySeatReservation.Web.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<SimulatedUser> SimulatedUsers => Set<SimulatedUser>();
    public DbSet<Seat> Seats => Set<Seat>();
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<Admin> Admins => Set<Admin>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Seat>(e =>
        {
            e.Property(s => s.SeatNumber).HasMaxLength(20);
            e.Property(s => s.Area).HasMaxLength(50);
            e.Property(s => s.Floor).HasMaxLength(10);
            e.Property(s => s.Description).HasMaxLength(200);
            e.HasIndex(s => s.Area);
            e.HasIndex(s => s.Status);
            e.HasIndex(s => new { s.Area, s.Status });
        });

        modelBuilder.Entity<SimulatedUser>(e =>
        {
            e.Property(u => u.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Admin>(e =>
        {
            e.Property(a => a.Username).HasMaxLength(50);
            e.Property(a => a.Password).HasMaxLength(100);
            e.HasIndex(a => a.Username).IsUnique();
        });

        modelBuilder.Entity<Reservation>(e =>
        {
            e.Property(r => r.UserName).HasMaxLength(50);
            e.Property(r => r.TimeSlot).HasMaxLength(20);
            e.Property(r => r.ReservationDate).HasColumnType("date");
            e.HasOne(r => r.Seat).WithMany().HasForeignKey(r => r.SeatId).OnDelete(DeleteBehavior.Restrict);
            e.HasIndex(r => new { r.SeatId, r.ReservationDate, r.TimeSlot }).IsUnique().HasFilter("[Status] = 0");
            e.HasIndex(r => r.UserName);
            e.HasIndex(r => r.Status);
            e.HasIndex(r => r.ReservationDate);
            e.HasIndex(r => r.SeatId);
        });
    }
}
