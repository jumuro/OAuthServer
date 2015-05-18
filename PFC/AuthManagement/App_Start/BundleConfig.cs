using System.Web;
using System.Web.Optimization;

namespace Espa.Angular.App_Start
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                        "~/Scripts/angular.js",
                        "~/Scripts/angular-route.js",
                        "~/Scripts/angular-animate.js",
                        "~/Scripts/angular-ui/ui-bootstrap-tpls.js",
                        "~/Scripts/angular-cookies.js"
                        ));
            bundles.Add(new ScriptBundle("~/bundles/jsextra").Include(
                        "~/Scripts/extra/angular-cache-2.3.7.js"
                        ));

            /******************* Comment this out when packaging *****************************/
            bundles.Add(new ScriptBundle("~/bundles/angularapp").Include(
                        "~/app/app.js",
                        "~/app/controllers/*.js",
                        "~/app/constants/*.js",
                        "~/app/services/*.js",
                        "~/app/directives/*.js"
                        ));
            

            bundles.Add(new ScriptBundle("~/bundles/angularappNugets").IncludeDirectory("~/appNugets", "*.js", true));
            
            bundles.Add(new ScriptBundle("~/bundles/angulartemplates").Include(
                        "~/app/Templates/*.js"
                        ));
            /**************************************************************************/

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"
                        ));
            
            

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            bundles.Add(new StyleBundle("~/Content/sitecss").Include(
                      "~/Content/site.css",
                      "~/Content/csspinner.css"));

           

            
        }
    }
}
