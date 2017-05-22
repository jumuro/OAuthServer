using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(OAuthServer.Startup))]

namespace OAuthServer
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //Configure Autofac
            var dependencyResolver = ConfigureAutofac(app);

            //Configure CORS
            ConfigureCors(app);

            //Configure OAuth
            ConfigureOAuth(app, dependencyResolver);

            //Configure Web API
            ConfigureWebApi(app, dependencyResolver);
        }
    }
}
