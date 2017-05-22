using System;
using System.Configuration;
using System.Web.Http.Dependencies;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Infrastructure;
using Microsoft.Owin.Security.OAuth;
using OAuthServer.Constants;
using Owin;

namespace OAuthServer
{
    public partial class Startup
    {
        public void ConfigureOAuth(IAppBuilder app, IDependencyResolver dependencyResolver)
        {
            // Enable Application Sign In Cookie
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = "Application",
                AuthenticationMode = AuthenticationMode.Passive,
                LoginPath = new PathString(Paths.LoginPath),
                LogoutPath = new PathString(Paths.LogoutPath),
            });

            var OAuthServerOptions = new OAuthAuthorizationServerOptions()
            {
#if DEBUG
                AllowInsecureHttp = true,
#endif
                TokenEndpointPath = new PathString(Paths.TokenPath),
                AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(Convert.ToDouble(ConfigurationManager.AppSettings["DefaultAccessTokenExpireTime"])),
                Provider = (IOAuthAuthorizationServerProvider)dependencyResolver.GetService(typeof(IOAuthAuthorizationServerProvider)),
                RefreshTokenProvider = (IAuthenticationTokenProvider)dependencyResolver.GetService(typeof(IAuthenticationTokenProvider))
            };

            var OAuthBearerOptions = new OAuthBearerAuthenticationOptions();

            // Token generation
            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            // Token validation
            app.UseOAuthBearerAuthentication(OAuthBearerOptions);

            ////Configure Google External Login
            //googleAuthOptions = new GoogleOAuth2AuthenticationOptions()
            //{
            //    ClientId = "xxxxxx",
            //    ClientSecret = "xxxxxx",
            //    Provider = new GoogleAuthProvider()
            //};
            //app.UseGoogleAuthentication(googleAuthOptions);

            ////Configure Facebook External Login
            //facebookAuthOptions = new FacebookAuthenticationOptions()
            //{
            //    AppId = "xxxxxx",
            //    AppSecret = "xxxxxx",
            //    Provider = new FacebookAuthProvider()
            //};
            //app.UseFacebookAuthentication(facebookAuthOptions);
        }
    }
}