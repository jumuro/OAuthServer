using System;
using System.Collections.Generic;
using System.Configuration;
using System.Security.Claims;
using System.Threading.Tasks;
using OAuthServer.Models;
using OAuthServer.Services;
using OAuthServer.ViewModels;
using Jumuro.Security.Cryptography;
using Jumuro.Security.Cryptography.Extensions;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;

namespace OAuthServer.Providers
{
    public class AuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        #region Private Attributes

        private readonly IClientService _clientService;
        private readonly IUserService _userService;
        private readonly IHashProvider _hashProvider;

        #endregion

        #region AuthorizationServerProvider

        public AuthorizationServerProvider(IClientService clientService, IUserService userService, IHashProvider hashProvider)
            : base()
        {
            _clientService = clientService;
            _userService = userService;
            _hashProvider = hashProvider;
        }

        #endregion

        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            string clientId = string.Empty;
            string clientSecret = string.Empty;

            if (!context.TryGetBasicCredentials(out clientId, out clientSecret))
            {
                context.TryGetFormCredentials(out clientId, out clientSecret);
            }

            if (context.ClientId == null)
            {
                context.SetError("invalid_clientId", "ClientId should be sent.");
                return; 
            }

            ClientViewModel client;
            client = await _clientService.GetClientAsync(context.ClientId);

            if (client == null)
            {
                context.SetError("invalid_clientId", string.Format("Client '{0}' is not registered in the system.", context.ClientId));
                return;
            }

            if (client.ApplicationType.Id == (int)ApplicationTypes.NativeConfidential)
            {
                if (string.IsNullOrWhiteSpace(clientSecret))
                {
                    context.SetError("invalid_clientSecret", "Client secret should be sent.");
                    return;
                }
                else if (client.Secret != _hashProvider.GetSHA256Hash(clientSecret).ToBase64String())
                {
                    context.SetError("invalid_clientSecret", "Client secret is invalid.");
                    return;
                }
            }

            if (!client.IsActive)
            {
                context.SetError("invalid_clientId", "Client is inactive.");
                return;
            }

            context.OwinContext.Set<string>("clientAllowedOrigin", client.AllowedOrigin);
            context.OwinContext.Set<string>("clientAccessTokenExpireTime", client.AccessTokenExpireTime.ToString());
            context.OwinContext.Set<string>("clientRefreshTokenLifeTime", client.RefreshTokenLifeTime.ToString());
            //// Set the 
            //if (client.AccessTokenExpireTimeSpan > 0)
            //{
            //    context.Options.AccessTokenExpireTimeSpan = client.AccessTokenExpireTimeSpan;
            //}

            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var allowedOrigin = context.OwinContext.Get<string>("clientAllowedOrigin");

            if (allowedOrigin == null) allowedOrigin = "*";

            if (!context.OwinContext.Response.Headers.ContainsKey("Access-Control-Allow-Origin"))
            {
                context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { allowedOrigin });
            }

            UserViewModel user;

            user = await _userService.GetUserAsync(context.UserName, context.Password, context.ClientId);

            if (user == null)
            {
                context.SetError("invalid_grant", "The user name, password or clientId is incorrect.");
                return;
            }
            else if (!user.IsActive)
            {
                context.SetError("invalid_grant", "The user is inactive.");
                return;
            }

            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
            identity.AddClaim(new Claim(ClaimTypes.Sid, user.UserId));

            if (user.Role != null && !string.IsNullOrEmpty(user.Role.Name))
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, user.Role.Name));
            }

            var props = new AuthenticationProperties(new Dictionary<string, string>
            {
                { 
                    "client_id", (context.ClientId == null) ? string.Empty : context.ClientId
                }
//,
                //{ 
                //    "user_name", context.UserName
                //}
            });

            // If the role is not Admin, add audit url to the authentication properties.
            // This will be used to post audit infor from web api that uses the generated bearer token
            if (user.Role != null && user.Role.Name != "Admin")
            {
                props.Dictionary.Add("audit_url", ConfigurationManager.AppSettings["OAuthAuditURL"]);
            }

            var ticket = new AuthenticationTicket(identity, props);
            context.Validated(ticket);
        }

        public override Task GrantRefreshToken(OAuthGrantRefreshTokenContext context)
        {
            var originalClient = context.Ticket.Properties.Dictionary["client_id"];
            var currentClient = context.ClientId;
            
            //var currentUserName = context.UserName;
            //var originalUserName = context.Ticket.Identity.Name;
            //var currentUserId = context.UserId;
            //var originalUserId = context.Ticket.Identity.Claims.Where(c => c.Type == ClaimTypes.Sid).Select(c => c.Value).SingleOrDefault();

            //// Check that the refresh token exists and has been issued to the current client and user
            //if (refreshToken != null && clientId == refreshToken.ClientId && userId == refreshToken.UserId)


            if (originalClient != currentClient)
            {
                context.SetError("invalid_clientId", "Refresh token is issued to a different clientId.");
                return Task.FromResult<object>(null);
            }

            //TODO: Check that claims of the identity are the same that were when the refresh token was created. If not update the current claims in the refresh token

            // Change auth ticket for refresh token requests
            var newIdentity = new ClaimsIdentity(context.Ticket.Identity);

            //var newClaim = newIdentity.Claims.Where(c => c.Type == "newClaim").FirstOrDefault();
            //if (newClaim != null)
            //{
            //    newIdentity.RemoveClaim(newClaim);
            //}
            //newIdentity.AddClaim(new Claim("newClaim", "newValue"));

            var newTicket = new AuthenticationTicket(newIdentity, context.Ticket.Properties);
            context.Validated(newTicket);

            return Task.FromResult<object>(null);
        }

        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            // If the client has a specific AccessTokenExpireTime, override the default one with it
            var clientAccessTokenExpireTimeSpan = context.OwinContext.Get<string>("clientAccessTokenExpireTime");
            if (!string.IsNullOrEmpty(clientAccessTokenExpireTimeSpan) && Convert.ToDouble(clientAccessTokenExpireTimeSpan) > 0)
            {
                context.Properties.ExpiresUtc = new DateTimeOffset?(context.Properties.IssuedUtc.Value.Add(System.TimeSpan.FromMinutes(Convert.ToDouble(clientAccessTokenExpireTimeSpan))));
            }

            //foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            //{
            //    context.AdditionalResponseParameters.Add(property.Key, property.Value);
            //}
            // Include in the response only "client_id"
            context.AdditionalResponseParameters.Add("client_id", context.Properties.Dictionary["client_id"]);

            return Task.FromResult<object>(null);
        }
    }
}