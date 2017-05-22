using System.Collections.Generic;
using Microsoft.AspNet.Identity.EntityFramework;

namespace OAuthServer.Models
{
    public class User : IdentityUser
    {
        public User()
            : base()
        {
        }

        public User(string userName)
            : base(userName)
        {
        }

        public virtual ICollection<UserClient> Clients { get; set; }
    }
}