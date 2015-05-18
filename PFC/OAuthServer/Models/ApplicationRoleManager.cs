using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace OAuthServer.Models
{
    public class ApplicationRoleManager : RoleManager<IdentityRole>
    {
        public ApplicationRoleManager(OAuthServerDbContext dbContext)
            : base(new RoleStore<IdentityRole>(dbContext))
        {
        }
    }
}