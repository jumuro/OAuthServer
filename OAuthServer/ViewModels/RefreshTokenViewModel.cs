using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using OAuthServer.Models;

namespace OAuthServer.ViewModels
{
    public class RefreshTokenViewModel
    {
        #region Constructors

        public RefreshTokenViewModel() { }

        public RefreshTokenViewModel(RefreshToken refreshToken)
        {
            if (refreshToken != null)
            {
                RefreshTokenId = refreshToken.RefreshTokenId;
                UserId = refreshToken.UserId;
                UserName = refreshToken.UserName;
                ClientId = refreshToken.ClientId;
                IssuedUtc = refreshToken.IssuedUtc;
                ExpiresUtc = refreshToken.ExpiresUtc;
            }
        }

        #endregion

        #region Properties
		
        public string RefreshTokenId { get; set; }
        [MaxLength(256)]
        public string UserId { get; set; }
        [MaxLength(256)]
        public string UserName { get; set; }
        [MaxLength(100)]
        public string ClientId { get; set; }
        public DateTime IssuedUtc { get; set; }
        public DateTime ExpiresUtc { get; set; }
	    
        #endregion
    }
}