using System.Threading.Tasks;
using System.Web.Cors;
using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;

namespace OAuthServer
{
    public partial class Startup
    {
        public void ConfigureCors(IAppBuilder app)
        {
            var options = new CorsOptions()
            {
                PolicyProvider = new CorsPolicyProvider()
                {
                    PolicyResolver = (IOwinRequest context) =>
                    {
                        var policy = new CorsPolicy()
                        {
                            AllowAnyHeader = true,
                            AllowAnyMethod = true,
                            AllowAnyOrigin = true,
                            SupportsCredentials = true
                        };
                        policy.ExposedHeaders.Add("message");
                        return Task.FromResult<CorsPolicy>(policy);
                    }
                }
            };

            app.UseCors(options);
        }
    }
}