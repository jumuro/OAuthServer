using System;
using System.Configuration;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using OAuthServer.Models;
using OAuthServer.Services;
using Jumuro.Security.Cryptography;
using Jumuro.Security.Cryptography.Extensions;
using Microsoft.Owin.Security.Infrastructure;

namespace OAuthServer.Providers
{
    public class RefreshTokenProvider : IAuthenticationTokenProvider
    {
        #region Private Attributes

        private readonly IRefreshTokenService _refreshTokenService;
        private readonly IHashProvider _hashProvider;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        public RefreshTokenProvider(IRefreshTokenService refreshTokenService, IHashProvider hashProvider)
            : base()
        {
            _refreshTokenService = refreshTokenService;
            _hashProvider = hashProvider;
        }

        #endregion

    public async Task CreateAsync(AuthenticationTokenCreateContext context)
    {
        var clientId = context.Ticket.Properties.Dictionary["client_id"];

        if (string.IsNullOrEmpty(clientId))
        {
            return;
        }

        var refreshTokenId = Guid.NewGuid().ToString("n");

        // Get the refresh token life time for this client and set to the refresh token ticket
        var refreshTokenLifeTime = context.OwinContext.Get<string>("clientRefreshTokenLifeTime");

        if (string.IsNullOrEmpty(refreshTokenLifeTime))
        {
            // Get the default refresh token life time
            refreshTokenLifeTime = ConfigurationManager.AppSettings["DefaultRefreshTokenLifeTime"];
        }

        var token = new RefreshToken()
        {
            RefreshTokenId = _hashProvider.GetSHA256Hash(refreshTokenId).ToBase64String(),
            ClientId = clientId,
            UserName = context.Ticket.Identity.Name,
            UserId = context.Ticket.Identity.Claims.Where(c => c.Type == ClaimTypes.Sid).Select(c => c.Value).SingleOrDefault(),
            IssuedUtc = DateTime.UtcNow,
            ExpiresUtc = DateTime.UtcNow.AddMinutes(Convert.ToDouble(refreshTokenLifeTime))
        };

        // Set the issued and expires times to the ticket
        context.Ticket.Properties.IssuedUtc = token.IssuedUtc;
        context.Ticket.Properties.ExpiresUtc = token.ExpiresUtc;

        // Serialize the refresh token ticket to store it in database
        token.ProtectedTicket = context.SerializeTicket();

        var result = await _refreshTokenService.InsertRefreshTokenAsync(token);

        if (result != null)
        {
            context.SetToken(refreshTokenId);
        }
    }

public async Task ReceiveAsync(AuthenticationTokenReceiveContext context)
{
    //var allowedOrigin = context.OwinContext.Get<string>("clientAllowedOrigin");
    //context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { allowedOrigin });

    string hashedTokenId = _hashProvider.GetSHA256Hash(context.Token).ToBase64String();

    var refreshToken = await _refreshTokenService.GetRefreshTokenAsync(hashedTokenId);

    // Check that the refresh token exists
    if (refreshToken != null)
    {
        // Get protectedTicket from refreshToken class
        context.DeserializeTicket(refreshToken.ProtectedTicket);

        // Delete the token from database because it is going to be created again in CreateAsync() method that is called after ReceiveAsync()
        var result = await _refreshTokenService.DeleteRefreshTokenAsync(hashedTokenId);
    }
}
        
        public void Receive(AuthenticationTokenReceiveContext context)
        {
            throw new NotImplementedException();
        } 
        
        public void Create(AuthenticationTokenCreateContext context)
        {
            throw new NotImplementedException();
        }
    }
}