using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Routing;
using OAuthServer.Filters.Attributes;
using OAuthServer.Models;
using OAuthServer.Services;
using OAuthServer.ViewModels;
using Jumuro.WebApi.Extensions;
using Jumuro.WebApi.Extensions.ActionResults;

namespace OAuthServer.Controllers
{
    [ApplicationAuthorize(Roles = "Admin")]
    [RoutePrefix("api/authserver/refreshTokens")]
    public class RefreshTokenController : ApiController
    {
        #region Private Attributes

        private readonly IRefreshTokenService _refreshTokenService;
        
        #endregion

        #region Constructor

        public RefreshTokenController(IRefreshTokenService refreshTokenService)
        {
            _refreshTokenService = refreshTokenService;
        }

        #endregion

        #region GetRefreshTokensAsync

        /// <summary>
        /// Gets all refresh tokens.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetRefreshTokensAsync()
        {
            var refreshTokens = (await _refreshTokenService.GetRefreshTokensAsync()).OrderByDescending(rt => rt.IssuedUtc).ToList().Select(rt => new RefreshTokenViewModel(rt)).ToList();

            return Ok<IEnumerable<RefreshTokenViewModel>>(refreshTokens);
        }

        #endregion

        #region GetRefreshTokensAsync

        /// <summary>
        /// Gets all refresh tokens.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("paginated")]
        public async Task<IHttpActionResult> GetRefreshTokensAsync(int currentPage = 0, int perPage = 0)
        {
            var refreshTokensQuery = (await _refreshTokenService.GetRefreshTokensAsync()).OrderByDescending(rt => rt.IssuedUtc);
            // Get total refresh tokens count
            var totalEntries = refreshTokensQuery.Count();

            // If pageSize == 0 (default), set it to totalCount
            perPage = (perPage == 0 ? totalEntries : perPage);

            // Set the total pages
            var totalPages = (int)Math.Ceiling((double)totalEntries / perPage);

            var refreshTokens = refreshTokensQuery.Skip(perPage * currentPage)
                                                  .Take(perPage)
                                                  .ToList()
                                                  .Select(rt => new RefreshTokenViewModel(rt));

            return this.Ok<IEnumerable<RefreshTokenViewModel>>(refreshTokens, currentPage, perPage, totalPages, totalEntries, "currentPage", "perPage");
        }

        #endregion

        #region GetRefreshTokenAsync

        /// <summary>
        /// Gets a refresh token by its id.
        /// </summary>
        /// <param name="refreshTokenId"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("{refreshTokenId}")]
        public async Task<IHttpActionResult> GetRefreshTokenAsync(string refreshTokenId)
        {
            var refreshToken = await _refreshTokenService.GetRefreshTokenAsync(refreshTokenId);

            if (refreshToken == null)
            {
                return this.NotFound(string.Format("RefreshToken with Id '{0}' not found.", refreshTokenId));
            }

            return Ok<RefreshToken>(refreshToken);
        }

        #endregion

        #region PostRefreshTokenAsync

        /// <summary>
        /// Inserts a refresh token.
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> PostRefreshTokenAsync([FromBody] RefreshToken refreshToken)
        {
            if (!ModelState.IsValid)
            {
                return new ModelStateErrorResult(ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray(), Request);
            }

            if (await _refreshTokenService.RefreshTokenExistsAsync(refreshToken.RefreshTokenId))
            {
                return this.Conflict(string.Format("A refresh token with the Id '{0}' already exists.", refreshToken.RefreshTokenId));
            }

            var insertedRefreshToken = await _refreshTokenService.InsertRefreshTokenAsync(refreshToken);

            return this.Created<RefreshToken>(Request.RequestUri, insertedRefreshToken, "Refresh token created successfully.");
        }

        #endregion

        #region PutRefreshTokenAsync

        /// <summary>
        /// Updates a refresh token.
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("")]
        public async Task<IHttpActionResult> PutRefreshTokenAsync([FromBody] RefreshToken refreshToken)
        {
            if (!ModelState.IsValid)
            {
                return new ModelStateErrorResult(ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray(), Request);
            }

            if (!await _refreshTokenService.RefreshTokenExistsAsync(refreshToken.RefreshTokenId))
            {
                return this.NotFound(string.Format("A refresh token with the id '{0}' does not exist.", refreshToken.RefreshTokenId));
            }

            var updatedRefreshToken = await _refreshTokenService.UpdateRefreshTokenAsync(refreshToken);

            return this.Ok<RefreshToken>(refreshToken, "Refresh token updated successfully.");
        }

        #endregion

        #region DeleteRefreshTokenAsync

        /// <summary>
        /// Deletes a refreshToken.
        /// The RefreshTokenId is the hash of a Guid. It can contain symbols like '+' or '/'. Then we receive the refreshTokenId in query string instead of a route parameter.
        /// </summary>
        /// <param name="refresh tokenId"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("")]
        public async Task<IHttpActionResult> DeleteRefreshTokenAsync(string refreshTokenId)
        {
            if (!await _refreshTokenService.RefreshTokenExistsAsync(refreshTokenId))
            {
                return this.NotFound(string.Format("A refresh token with the id '{0}' does not exist.", refreshTokenId));
            }

            var deletedRefreshToken = await _refreshTokenService.DeleteRefreshTokenAsync(refreshTokenId);

            return this.Ok<RefreshTokenViewModel>(deletedRefreshToken, "Refresh token deleted successfully.");
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
                //if (_refreshTokenService != null)
                //{
                //    _refreshTokenService.Dispose();
                //}
            }

            base.Dispose(disposing);
        }

        #endregion
    }
}
