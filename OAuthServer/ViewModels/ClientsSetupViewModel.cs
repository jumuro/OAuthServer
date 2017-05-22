using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using OAuthServer.Models;

namespace OAuthServer.ViewModels
{
    public class ClientsSetupViewModel
    {
        public IEnumerable<ClientViewModel> Clients;
        public IEnumerable<ApplicationType> ApplicationTypes;
    }

    public class ClientViewModel
    {
        #region Constructors

        public ClientViewModel() { }

        public ClientViewModel(Client client)
        {
            if (client != null)
            {
                ClientId = client.ClientId;
                Secret = client.Secret;
                Description = client.Description;
                ApplicationType = new ApplicationType { Id = (int)client.ApplicationType, Description = client.ApplicationType.ToString() };
                IsActive = client.Active;
                AccessTokenExpireTime = client.AccessTokenExpireTime;
                RefreshTokenLifeTime = client.RefreshTokenLifeTime;
                AllowedOrigin = client.AllowedOrigin;
            }
        }

        #endregion

        #region Properties
        
        [MaxLength(100)]
        public string ClientId { get; set; }
        [Required]
        public string Secret { get; set; }
        [MaxLength(100)]
        public string Description { get; set; }
        public ApplicationType ApplicationType { get; set; }
        public bool IsActive { get; set; }
        public int AccessTokenExpireTime { get; set; } /* In minutes */
        public int RefreshTokenLifeTime { get; set; } /* In minutes */
        [MaxLength(100)]
        public string AllowedOrigin { get; set; }

        #endregion
    }

    public class ApplicationType
    {
        public int Id { get; set; }
        public string Description { get; set; }
    }
}