using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using OAuthServer.Filters.Attributes;
using OAuthServer.Models;
using OAuthServer.Services;
using OAuthServer.ViewModels;
using Jumuro.WebApi.Extensions;
using Jumuro.WebApi.Extensions.ActionResults;

namespace OAuthServer.Controllers
{
    [ApplicationAuthorize(Roles = "Admin")]
    [RoutePrefix("api/authserver/clients")]
    public class ClientController : ApiController
    {
        #region Private Attributes

        private readonly IClientService _clientService;

        #endregion

        #region Constructor

        public ClientController(IClientService clientService)
        {
            _clientService = clientService;
        }

        #endregion

        #region GetClientsAsync

        /// <summary>
        /// Gets all clients.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetClientsAsync()
        {
            var lstClients = await _clientService.GetClientsAsync();

            return Ok<IEnumerable<ClientViewModel>>(lstClients);
        }

        #endregion

        #region GetClientAsync

        /// <summary>
        /// Gets a client by its id.
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{clientId}")]
        public async Task<IHttpActionResult> GetClientAsync(string clientId)
        {
            var oClient = await _clientService.GetClientAsync(clientId);

            if (oClient == null)
            {
                return this.NotFound(string.Format("Client with Id '{0}' not found.", clientId));
            }

            return this.Ok<ClientViewModel>(oClient);
        }

        #endregion

        #region PostClientAsync

        /// <summary>
        /// Inserts a client.
        /// </summary>
        /// <param name="client"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> PostClientAsync([FromBody]ClientViewModel clientViewModel)
        {
            if (!ModelState.IsValid)
            {
                return new ModelStateErrorResult(ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray(), Request);
            }

            if (await _clientService.ClientExistsAsync(clientViewModel.ClientId))
            {
                return this.Conflict(string.Format("A client with the Id '{0}' already exists.", clientViewModel.ClientId));
            }

            var insertedClient = await _clientService.InsertClientAsync(clientViewModel);

            return this.Created<ClientViewModel>(Request.RequestUri, insertedClient, "Client created successfully.");
        }

        #endregion

        #region PutClientAsync

        /// <summary>
        /// Updates a client.
        /// </summary>
        /// <param name="client"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("")]
        public async Task<IHttpActionResult> PutClientAsync(ClientViewModel clientViewModel)
        {
            if (!ModelState.IsValid)
            {
                return new ModelStateErrorResult(ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray(), Request);
            }

            if (!await _clientService.ClientExistsAsync(clientViewModel.ClientId))
            {
                return this.NotFound(string.Format("A client with the id '{0}' does not exist.", clientViewModel.ClientId));
            }

            var updatedClient = await _clientService.UpdateClientAsync(clientViewModel);

            return this.Ok<ClientViewModel>(clientViewModel, "Client updated successfully.");
        }

        #endregion

        #region DeleteClientAsync

        /// <summary>
        /// Deletes a client.
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{clientId}")]
        public async Task<IHttpActionResult> DeleteClientAsync(string clientId)
        {
            if (!await _clientService.ClientExistsAsync(clientId))
            {
                return this.NotFound(string.Format("A client with the id '{0}' does not exist.", clientId));
            }

            if (await _clientService.ClientHasAssociatedUsersAsync(clientId))
            {
                return this.Conflict(string.Format("The client with the id '{0}' has associated users.", clientId));
            }

            var deletedClient = await _clientService.DeleteClientAsync(clientId);

            return this.Ok<ClientViewModel>(deletedClient, "Client deleted successfully.");
        }

        #endregion

        #region GetClientsForSetupAsync

        /// <summary>
        /// Gets all clients for setup.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("setup")]
        public async Task<IHttpActionResult> GetClientsForSetupAsync()
        {
            var clients = await _clientService.GetClientsForSetupAsync();

            return Ok<ClientsSetupViewModel>(clients);
        }

        #endregion

        #region GetRefreshTokensByClientAsync

        /// <summary>
        /// Gets a client by its id.
        /// </summary>
        /// <param name="clientId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{clientId}/refreshTokens")]
        public async Task<IHttpActionResult> GetRefreshTokensByClientAsync(string clientId)
        {
            if (!await _clientService.ClientExistsAsync(clientId))
            {
                return this.NotFound(string.Format("A client with the id '{0}' does not exist.", clientId));
            }

            var lstRefreshTokens = await _clientService.GetRefreshTokensByClientAsync(clientId);

            return this.Ok<IEnumerable<RefreshToken>>(lstRefreshTokens);
        }

        #endregion

        #region IDisposable Implementation

        /// <summary>
        /// Disposes managed resources.
        /// </summary>
        /// <param name="disposing"></param>
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                //if (_clientService != null)
                //{
                //    _clientService.Dispose();
                //}
            }

            base.Dispose(disposing);
        }

        #endregion
    }
}
