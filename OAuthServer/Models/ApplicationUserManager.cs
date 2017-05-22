using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace OAuthServer.Models
{
    public class ApplicationUserManager : UserManager<User>
    {
        public ApplicationUserManager(OAuthServerDbContext dbContext)
            : base(new UserStore<User>(dbContext))
        {
        }
    }
}