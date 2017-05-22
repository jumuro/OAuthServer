namespace AuthServer.Migrations
{
    using System.Data.Entity.Migrations;
    using System.Linq;
    using OAuthServer.Models;
    using OAuthServer.Services;
    using OAuthServer.ViewModels;
    using Jumuro.Security.Cryptography;
    using Jumuro.Security.Cryptography.Extensions;
    using Microsoft.AspNet.Identity.EntityFramework;

    internal sealed class Configuration : DbMigrationsConfiguration<OAuthServer.Models.OAuthServerDbContext>
    {
        #region Private Attributes

        private readonly IHashProvider _hashProvider;

        #endregion

        #region Constructor

        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            _hashProvider = new HashProvider();
        }

        #endregion

        #region Seed

        protected override void Seed(OAuthServer.Models.OAuthServerDbContext context)
        {
            // Initialize clients
            var angularAdminClient =
                new Client
                {
                    Active = true,
                    AllowedOrigin = "*",
                    ApplicationType = ApplicationTypes.Javascript,
                    Description = "OAuth Management App",
                    ClientId = "ngOAuthManagementApp",
                    AccessTokenExpireTime = 10,
                    RefreshTokenLifeTime = 10080, // 1 week in minutes
                    Secret = _hashProvider.GetSHA256Hash("ngoauthmanagementapp-clientid").ToBase64String()
                };

            context.Clients.AddOrUpdate(angularAdminClient);

            // Initialize roles
            var adminRole = new IdentityRole("Admin");
            var appRole = new IdentityRole("App");

            context.Roles.AddOrUpdate(
                r => r.Name,
                adminRole, appRole);

            context.SaveChanges();

            // Initialize users
            using (var _userService = new UserService(context, new ApplicationUserManager(context), null, null))
            {
                if (!context.Users.Any(u => u.UserName == "OAuthAdmin"))
                {
                    _userService.InsertUser(new UserViewModel
                    {
                        UserName = "OAuthAdmin",
                        Password = "OAuthAdminPassword",
                        IsActive = true,
                        Client = new ClientViewModel(angularAdminClient),
                        Role = new RoleViewModel(adminRole)
                    });
                }
            }
        }

        #endregion
    }
}