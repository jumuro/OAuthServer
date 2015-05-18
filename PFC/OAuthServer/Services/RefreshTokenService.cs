using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using OAuthServer.Models;
using OAuthServer.ViewModels;

namespace OAuthServer.Services
{
    public interface IRefreshTokenService : IDisposable
    {
        Task<IQueryable<RefreshToken>> GetRefreshTokensAsync();
        Task<RefreshToken> GetRefreshTokenAsync(string refreshTokenId);
        Task<RefreshToken> InsertRefreshTokenAsync(RefreshToken refreshToken);
        Task<RefreshToken> UpdateRefreshTokenAsync(RefreshToken refreshToken);
        Task<RefreshTokenViewModel> DeleteRefreshTokenAsync(string refreshTokenId);
        Task<bool> RefreshTokenExistsAsync(string refreshTokenId);
    }

    public class RefreshTokenService : IRefreshTokenService
    {
        #region Private Attributes

        /// <summary>
        /// WebApiUsersDbContext object with the connection to database.
        /// </summary>
        private readonly OAuthServerDbContext _dbContext;

        /// <summary>
        /// Track whether Dispose has been called. 
        /// </summary>
        private bool _disposed = false;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        public RefreshTokenService(OAuthServerDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        #endregion

        #region GetRefreshTokenAsync

        /// <summary>
        /// Gets a refresh token by Id
        /// </summary>
        /// <param name="refreshTokenId"></param>
        /// <returns></returns>
        public async Task<RefreshToken> GetRefreshTokenAsync(string refreshTokenId)
        {
            return await _dbContext.RefreshTokens.FindAsync(refreshTokenId);
        }

        #endregion

        #region GetRefreshTokensAsync

        /// <summary>
        /// Gets all refresh tokens
        /// </summary>
        /// <returns></returns>
        public async Task<IQueryable<RefreshToken>> GetRefreshTokensAsync()
        {
            return await Task.Run(() => _dbContext.RefreshTokens);
        }

        #endregion

        #region InsertRefreshTokenAsync

        /// <summary>
        /// Inserts a refreshToken.
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        public async Task<RefreshToken> InsertRefreshTokenAsync(RefreshToken refreshToken)
        {
            RefreshToken insertedRefreshToken = _dbContext.RefreshTokens.Add(refreshToken);

            await _dbContext.SaveChangesAsync();

            return insertedRefreshToken;
        }

        #endregion

        #region InsertOrReplaceRefreshTokenAsync

        /// <summary>
        /// Inserts a refreshToken.
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        public async Task<RefreshToken> InsertOrReplaceRefreshTokenAsync(RefreshToken refreshToken)
        {
            var existingToken = _dbContext.RefreshTokens.Where(r => r.UserName == refreshToken.UserName && r.ClientId == refreshToken.ClientId).SingleOrDefault();

            if (existingToken != null)
            {
                await DeleteRefreshTokenAsync(existingToken);
            }

            RefreshToken insertedRefreshToken = await InsertRefreshTokenAsync(refreshToken);

            return insertedRefreshToken;
        }

        #endregion

        #region UpdateRefreshTokenAsync

        /// <summary>
        /// Updates a refreshToken.
        /// </summary>
        /// <param name="refreshToken"></param>
        /// <returns></returns>
        public async Task<RefreshToken> UpdateRefreshTokenAsync(RefreshToken refreshToken)
        {
            _dbContext.Entry(refreshToken).State = EntityState.Modified;

            await _dbContext.SaveChangesAsync();

            return await GetRefreshTokenAsync(refreshToken.RefreshTokenId);
        }

        #endregion

        #region DeleteRefreshTokenAsync

        /// <summary>
        /// Deletes a refreshToken.
        /// </summary>
        /// <param name="refreshTokenId"></param>
        /// <returns></returns>
        public async Task<RefreshTokenViewModel> DeleteRefreshTokenAsync(string refreshTokenId)
        {
            RefreshToken deletedRefreshToken = null;
            RefreshToken refreshTokenToDelete = await _dbContext.RefreshTokens.FindAsync(refreshTokenId);

            if (refreshTokenToDelete != null)
            {
                deletedRefreshToken = _dbContext.RefreshTokens.Remove(refreshTokenToDelete);
                await _dbContext.SaveChangesAsync();
            }

            return new RefreshTokenViewModel
            {
                RefreshTokenId = deletedRefreshToken.RefreshTokenId,
                UserId = deletedRefreshToken.UserId,
                UserName = deletedRefreshToken.UserName,
                ClientId = deletedRefreshToken.ClientId,
                IssuedUtc = deletedRefreshToken.IssuedUtc,
                ExpiresUtc = deletedRefreshToken.ExpiresUtc
            };
        }

        /// <summary>
        /// Deletes a refreshToken.
        /// </summary>
        /// <param name="refreshTokenId"></param>
        /// <returns></returns>
        public async Task<RefreshToken> DeleteRefreshTokenAsync(RefreshToken refreshTokenToDelete)
        {
            RefreshToken deletedRefreshToken = _dbContext.RefreshTokens.Remove(refreshTokenToDelete);

            await _dbContext.SaveChangesAsync();

            return deletedRefreshToken;
        }

        #endregion

        #region RefreshTokenExistsAsync

        /// <summary>
        /// Checks if a refreshToken id already exists.
        /// </summary>
        /// <param name="refreshTokenName"></param>
        /// <returns></returns>
        public async Task<bool> RefreshTokenExistsAsync(string refreshTokenId)
        {
            int refreshTokenCount = await _dbContext.RefreshTokens.CountAsync(c => c.RefreshTokenId == refreshTokenId);
            return (refreshTokenCount > 0);
        }

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