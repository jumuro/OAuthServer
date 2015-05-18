
namespace Espa.Angular.App_Start
{
    using System.Web.Routing;
    using System.Web.Mvc;
    using Espa.Angular.Handlers;

    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.Add("Default", new DefaultRoute());
        }
    }
}