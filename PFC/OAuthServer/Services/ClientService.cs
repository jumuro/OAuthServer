using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using OAuthServer.Models;
using OAuthServer.ViewModels;
using Jumuro.Security.Cryptography;
using Jumuro.Security.Cryptography.Extensions;

namespace OAuthServer.Services
{
    public interface IClientService : IDisposable
    {
        Task<IEnumerable<ClientViewModel>> GetClientsAsync();
        Task<ClientViewModel> GetClientAsync(string clientId);
        Task<ClientViewModel> InsertClientAsync(ClientViewModel clientViewModel);
        Task<ClientViewModel> UpdateClientAsync(ClientViewModel clientViewModel);
        Task<ClientViewModel> DeleteClientAsync(string clientId);
        Task<bool> ClientExistsAsync(string clientId);
        Task<bool> ClientHasAssociatedUsersAsync(string clientId);
        Task<ClientsSetupViewModel> GetClientsForSetupAsync();
        Task<IEnumerable<RefreshToken>> GetRefreshTokensByClientAsync(string clientId);
    }

    public class ClientService : IClientService
    {
        #region Private Attributes

        /// <summary>
        /// WebApiUsersDbContext object with the connection to database.
        /// </summary>
        private readonly OAuthServerDbContext _dbContext;

        /// <summary>
        /// Object for computing the hash.
        /// </summary>
        private readonly IHashProvider _hashProvider;

        /// <summary>
        /// Track whether Dispose has been called. 
        /// </summary>
        private bool _disposed = false;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        public ClientService(OAuthServerDbContext dbContext, IHashProvider hashProvider)
        {
            _dbContext = dbContext;
            _hashProvider = hashProvider;
        }

        #endregion

        #region GetClientAsync

        /// <summary>
        /// Gets a client by Id
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
        public async Task<ClientViewModel> GetClientAsync(string clientId)
        {
            var client = await _dbContext.Clients.FindAsync(clientId);

            return ((client != null) ? new ClientViewModel(client) : null);
        }

        #endregion

        #region GetClientsAsync

        /// <summary>
        /// Gets all clients
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<ClientViewModel>> GetClientsAsync()
        {
            var clients = await _dbContext.Clients.OrderBy(c => c.ClientId).ToListAsync();

            return (from c in clients
                    select new ClientViewModel(c)
                   ).ToList();
        }

        #endregion

        #region InsertClientAsync

        /// <summary>
        /// Inserts a client.
        /// </summary>
        /// <param name="clientViewModel"></param>
        /// <returns></returns>
        public async Task<ClientViewModel> InsertClientAsync(ClientViewModel clientViewModel)
        {
            var insertedClient = _dbContext.Clients.Add(CopyClientViewModelToClient(clientViewModel));

            await _dbContext.SaveChangesAsync();

            return await GetClientAsync(clientViewModel.ClientId);
        }

        #endregion

        #region UpdateClientAsync

        /// <summary>
        /// Updates a client.
        /// </summary>
        /// <param name="clientViewModel"></param>
        /// <returns></returns>
        public async Task<ClientViewModel> UpdateClientAsync(ClientViewModel clientViewModel)
        {
            var client = await _dbContext.Clients.FindAsync(clientViewModel.ClientId);

            client.Secret = _hashProvider.GetSHA256Hash(clientViewModel.Secret).ToBase64String();
            client.Description = clientViewModel.Description;
            client.ApplicationType = (ApplicationTypes)clientViewModel.ApplicationType.Id;
            client.Active = clientViewModel.IsActive;
            client.AccessTokenExpireTime = clientViewModel.AccessTokenExpireTime;
            client.RefreshTokenLifeTime = clientViewModel.RefreshTokenLifeTime;
            client.AllowedOrigin = clientViewModel.AllowedOrigin;

            // If the client is inactive, delete all tokens in RefreshTokens for this client
            if (!clientViewModel.IsActive)
            {
                _dbContext.RefreshTokens.RemoveRange(_dbContext.RefreshTokens.Where(rt => rt.ClientId == clientViewModel.ClientId));
            }

            _dbContext.Entry(client).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();

            return (ClientViewModel)await GetClientAsync(clientViewModel.ClientId);
        }

        #endregion

        #region DeleteClientAsync

        /// <summary>
        /// Deletes a client.
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
        public async Task<ClientViewModel> DeleteClientAsync(string clientId)
        {
            Client deletedClient = null;
            Client clientToDelete = await _dbContext.Clients.FindAsync(clientId);

            if (clientToDelete != null)
            {
                deletedClient = _dbContext.Clients.Remove(clientToDelete);

                await _dbContext.SaveChangesAsync();
            }

            return new ClientViewModel(deletedClient);
        }

        #endregion

        #region ClientExistsAsync

        /// <summary>
        /// Checks if a client id already exists.
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
        public async Task<bool> ClientExistsAsync(string clientId)
        {
            int clientCount = await _dbContext.Clients.CountAsync(c => c.ClientId == clientId);
            return (clientCount > 0);
        }

        #endregion

        #region ClientHasAssociatedUsersAsync

        /// <summary>
        /// Checks if a client has associated users.
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
        public async Task<bool> ClientHasAssociatedUsersAsync(string clientId)
        {
            int usersCount = await _dbContext.UserClients.CountAsync(uc => uc.ClientId == clientId);
            return (usersCount > 0);
        }

        #endregion

        #region GetRefreshTokensByClientAsync

        /// <summary>
        /// Gets all refresh tokens for a client.
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
        public async Task<IEnumerable<RefreshToken>> GetRefreshTokensByClientAsync(string clientId)
        {
            var query = from c in _dbContext.Clients
                        join rt in _dbContext.RefreshTokens
                            on c.ClientId equals rt.ClientId
                        where c.ClientId == clientId
                        select rt;

            return await query.ToListAsync();
        }

        #endregion

        #region GetClientsForSetupAsync

        /// <summary>
        /// Gets all clients for setup
        /// </summary>
        /// <returns></returns>
        public async Task<ClientsSetupViewModel> GetClientsForSetupAsync()
        {
            return new ClientsSetupViewModel
            {
                Clients = await GetClientsAsync(),
                ApplicationTypes = (from at in Enum.GetValues(typeof(ApplicationTypes)).Cast<ApplicationTypes>()
                                    select new ApplicationType { Id = (int)at, Description = at.ToString() }
                                   ).ToList()
            };
        }

        #endregion

        #region Private Methods

        //#region CopyClientToClientViewModel

        ///// <summary>
        ///// 
        ///// </summary>
        ///// <param name="client"></param>
        ///// <returns></returns>
        //public ClientViewModel CopyClientToClientViewModel(Client client)
        //{
        //    if (client != null)
        //    {
        //        return new ClientViewModel
        //        {
        //            ClientId = client.ClientId,
        //            Secret = client.Secret,
        //            Description = client.Description,
        //            ApplicationType = new ApplicationType { Id = (int)client.ApplicationType, Description = client.ApplicationType.ToString() },
        //            IsActive = client.Active,
        //            AccessTokenExpireTime = client.AccessTokenExpireTime,
        //            RefreshTokenLifeTime = client.RefreshTokenLifeTime,
        //            AllowedOrigin = client.AllowedOrigin
        //        };
        //    }

        //    return null;
        //}

        //#endregion

        #region CopyClientViewModelToClient

        /// <summary>
        /// 
        /// </summary>
        /// <param name="clientViewModel"></param>
        /// <returns></returns>
        private Client CopyClientViewModelToClient(ClientViewModel clientViewModel)
        {
            if (clientViewModel != null)
            {
                return new Client
                {
                    ClientId = clientViewModel.ClientId,
                    Secret = _hashProvider.GetSHA256Hash(clientViewModel.Secret).ToBase64String(),
                    Description = clientViewModel.Description,
                    ApplicationType = (ApplicationTypes) clientViewModel.ApplicationType.Id,
                    Active = clientViewModel.IsActive,
                    AccessTokenExpireTime = clientViewModel.AccessTokenExpireTime,
                    RefreshTokenLifeTime = clientViewModel.RefreshTokenLifeTime,
                    AllowedOrigin = clientViewModel.AllowedOrigin
                };
            }

            return null;
        }

        #endregion

        #endregion

        #region IDisposable Implementation

        /// <summary>
        /// Disposes managed resources.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Disposes managed resources.
        /// </summary>
        /// <param name="disposing"></param>
        protected virtual void Dispose(bool disposing)
        {
            // Check to see if Dispose has already been called.
            if (!_disposed)
            {
                if (disposing)
                {
                    //if (_dbContext != null)
                    //{
                    //    _dbContext.Dispose();
                    //}
                }

                _disposed = true;
            }
        }

        #endregion
    }
}