using System.Web.Http.Dependencies;
using OAuthServer.Models;
using OAuthServer.Providers;
using Autofac;
using Autofac.Builder;
using Autofac.Integration.WebApi;
using Jumuro.Security.Cryptography;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.Infrastructure;
using Microsoft.Owin.Security.OAuth;
using Owin;

namespace OAuthServer
{
    public partial class Startup
    {
        public IDependencyResolver ConfigureAutofac(IAppBuilder app)
        {
            var builder = new ContainerBuilder();

            builder.RegisterType<OAuthServerDbContext>()
                .InstancePerLifetimeScope();

            // Register all the repository Interfaces for the Services
            builder.RegisterAssemblyTypes(typeof(Startup).Assembly)
                .Where(t => t.Name.EndsWith("Service"))
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope();

            builder.RegisterType<UserStore<User>>()
                //.AsImplementedInterfaces<IUserStore<User>, ConcreteReflectionActivatorData>()
                .InstancePerLifetimeScope();

            builder.RegisterType<RoleStore<IdentityRole>>()
                //.AsImplementedInterfaces<IRoleStore<IdentityRole>, ConcreteReflectionActivatorData>()
                .InstancePerLifetimeScope();

            builder.RegisterType<ApplicationUserManager>()
                .InstancePerLifetimeScope();

            builder.RegisterType<ApplicationRoleManager>()
                .InstancePerLifetimeScope();

            builder.RegisterType<HashProvider>()
                .AsImplementedInterfaces<IHashProvider, ConcreteReflectionActivatorData>()
                .SingleInstance();

            builder.RegisterType<AuthorizationServerProvider>()
                .AsImplementedInterfaces<IOAuthAuthorizationServerProvider, ConcreteReflectionActivatorData>();

            builder.RegisterType<RefreshTokenProvider>()
                .AsImplementedInterfaces<IAuthenticationTokenProvider, ConcreteReflectionActivatorData>();

            // Register Web API controller in currrent assembly.
            builder.RegisterApiControllers(typeof(Startup).Assembly);

            var container = builder.Build();

            // This should be the first middleware added to the IAppBuilder.
            app.UseAutofacMiddleware(container);

            // Create a dependency resolver and return it
            return new AutofacWebApiDependencyResolver(container);
        }
	}
}