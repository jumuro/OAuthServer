using System.Data.Entity;
//using OAuthServer.Migrations;
using Microsoft.AspNet.Identity.EntityFramework;

namespace OAuthServer.Models
{
    //public interface IWebApiUsersDbContext : IDisposable, IObjectContextAdapter
    //{
    //    DbSet<Client> Clients { get; set; }
    //    DbSet<RefreshToken> RefreshTokens { get; set; }
    //    DbSet<UserClient> UserClients { get; set; }
    //    DbSet<Audit> Audits { get; set; }

    //    Task<int> SaveChangesAsync();
    //    DbEntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class;
    //}

    public class OAuthServerDbContext : IdentityDbContext<User>//, IWebApiUsersDbContext
    {
        public OAuthServerDbContext()
            : base("DefaultConnection")
        {
           // Database.SetInitializer<OAuthServerDbContext>(new MigrateDatabaseToLatestVersion<OAuthServerDbContext, Configuration>());
        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<UserClient> UserClients { get; set; }
        public DbSet<Audit> Audits { get; set; }

        //public override async Task<int> SaveChangesAsync()
        //{
        //    return await base.SaveChangesAsync();
        //}

        //public new DbEntityEntry<TEntity> Entry<TEntity>(TEntity obj) where TEntity : class
        //{
        //    return base.Entry<TEntity>(obj);
        //}
    }
}