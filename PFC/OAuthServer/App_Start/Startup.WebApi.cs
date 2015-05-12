using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.Dependencies;
using System.Web.Http.ExceptionHandling;
using OAuthServer.Filters.Attributes;
using OAuthServer.Tracing;
using Newtonsoft.Json.Serialization;
using Owin;

namespace OAuthServer
{
    public partial class Startup
    {
        public void ConfigureWebApi(IAppBuilder app, IDependencyResolver dependencyResolver)
        {
            var config = new HttpConfiguration
            {
                // Assign received dependency resolver for Web API to use.
                DependencyResolver = dependencyResolver
            };

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // Add a global authorization filter, to all ApiControllers
            config.Filters.Add(new ApplicationAuthorizeAttribute());
            
            // Add the default exception logger
            config.Services.Add(typeof(IExceptionLogger), new LogException());
            config.Services.Replace(typeof(IExceptionHandler), new GeneralException());

            // Configure Json Media Type Formatter
            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            app.UseWebApi(config);

            // Make sure the Autofac lifetime scope is passed to Web API.
            app.UseAutofacWebApi(config);
        }
    }
}
