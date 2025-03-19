using Microsoft.EntityFrameworkCore;
using SalamHack.Data.Entity.Identity;
using SalamHack.Models;

// Entity Framework Core Configuration
namespace SalamHack.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Furniture> Furniture { get; set; }
        public DbSet<Layout> Layouts { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<PriceComparison> PriceComparisons { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //  Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                // entity.HasIndex(e => e.Email).IsUnique();
                //entity.HasIndex(e => e.Username).IsUnique();

                entity.HasMany(e => e.Projects)
                    .WithOne(e => e.User)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Project>(entity =>
            {


                entity.HasMany(e => e.Rooms)
                    .WithOne(e => e.Project)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.Layouts)
                    .WithOne(e => e.Project)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.Reports)
                    .WithOne(e => e.Project)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Room>(entity =>
            {
                entity.HasOne(e => e.Project)
                    .WithMany(e => e.Rooms)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.Furniture)
                    .WithOne(e => e.Room)
                    .HasForeignKey(e => e.RoomId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Furniture>(entity =>
            {
                entity.HasOne(e => e.Room)
                    .WithMany(e => e.Furniture)
                    .HasForeignKey(e => e.RoomId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(e => e.PriceComparisons)
                    .WithOne(e => e.Furniture)
                    .HasForeignKey(e => e.FurnitureId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Layout>(entity =>
            {
                entity.HasOne(e => e.Project)
                    .WithMany(e => e.Layouts)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Report>(entity =>
            {
                entity.HasOne(e => e.Project)
                    .WithMany(e => e.Reports)
                    .HasForeignKey(e => e.ProjectId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<PriceComparison>(entity =>
            {
                entity.HasOne(e => e.Furniture)
                    .WithMany(e => e.PriceComparisons)
                    .HasForeignKey(e => e.FurnitureId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
