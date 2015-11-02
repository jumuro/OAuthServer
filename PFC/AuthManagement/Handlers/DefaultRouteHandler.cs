//using System;
//using System.Web;
//using System.Web.Routing;
//using System.Web.WebPages;
//using System.Linq;
//using Espa.Angular.Services;
//using System.Text.RegularExpressions;

//namespace Espa.Angular.Handlers
//{
//    public class DefaultRouteHandler : IRouteHandler
//    {
//        public IHttpHandler GetHttpHandler(RequestContext requestContext)
//        {
//            bool isUnathorized = false;
//            IHttpHandler handler = null;

//            // Replace ':' and '/' with '_' in cookie name because when creating the cookie in client (after the refresh token post) it is creating with HTML codes for this characters.
//            string cookieName = Regex.Replace(string.Format("AppInfo_{0}{1}", requestContext.HttpContext.Request.Url.Authority, requestContext.HttpContext.Request.Url.AbsolutePath),
//                                              @"[:\/]", "_");

//            // Get authentication ticket and generate AppInfo cookie
//            if (requestContext.HttpContext.Request.Cookies.Get(cookieName) == null)
//            {
//                var requestTokenService = new RequestTokenService();

//                string authenticationTicket = requestTokenService.GetAuthenticationTicket();

//                // If authentication ticket doesn't contains the 'access_token', don't generate the cookie and activate 
//                if (authenticationTicket.Contains("access_token"))
//                {
//                    var cookie = new HttpCookie(cookieName, authenticationTicket);
//                    cookie.Path = requestContext.HttpContext.Request.Url.AbsolutePath;

//                    requestContext.HttpContext.Response.Cookies.Add(cookie);
//                }
//                else
//                {
//                    // Activate flag to redirect to 401 page
//                    isUnathorized = true;
//                }
//            }


//            if (isUnathorized)
//            {
//                requestContext.HttpContext.Response.Redirect("~/401.cshtml");
//                //requestContext.RouteData.DataTokens.Add("templateUrl", "/401");
//                //handler = WebPageHttpHandler.CreateFromVirtualPath("~/401.cshtml");
//            }
//            else
//            {
//                // Use cases:
//                // ~/ -> ~/views/index.cshtml
//                // ~/about -> ~/views/about.cshtml or ~/views/about/index.cshtml
//                // ~/views/about -> ~/views/about.cshtml
//                // ~/xxx -> ~/views/404.cshtml
//                var filePath = requestContext.HttpContext.Request.AppRelativeCurrentExecutionFilePath;

//                if (filePath == "~/")
//                {
//                    filePath = "~/index.cshtml";
//                }
//                else
//                {
//                    if (!filePath.StartsWith("~/app/views/", StringComparison.OrdinalIgnoreCase))
//                    {
//                        filePath = filePath.Insert(2, "app/views/");
//                    }

//                    if (!filePath.EndsWith(".html", StringComparison.OrdinalIgnoreCase))
//                    {
//                        filePath = filePath += ".html";
//                    }
//                }

//                handler = WebPageHttpHandler.CreateFromVirtualPath(filePath); // returns NULL if .cshtml file wasn't found

//                if (handler == null)
//                {
//                    requestContext.RouteData.DataTokens.Add("templateUrl", "/404");
//                    handler = WebPageHttpHandler.CreateFromVirtualPath("~/404.cshtml");
//                }
//                else
//                {
//                    requestContext.RouteData.DataTokens.Add("templateUrl", filePath.Substring(1, filePath.Length - 8));
//                }
//            }

//            return handler;
//        }
//    }
//}