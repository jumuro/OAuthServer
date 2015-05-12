using System;
using System.Threading.Tasks;
using OAuthServer.Models;

namespace OAuthServer.Services
{
    public interface IAuditService : IDisposable
    {
        Task<Audit> InsertAuditAsync(Audit auditRecord);
    }

    public class AuditService: IAuditService
    {
        #region Private Attributes

        /// <summary>
        /// WebApiUsersDbContext object with the connection to database.
        /// </summary>
        private readonly WebApiUsersDbContext _dbContext;

        /// <summary>
        /// Tracks whether Dispose has been called. 
        /// </summary>
        private bool _disposed = false;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        public AuditService(WebApiUsersDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        #endregion

        #region InsertAuditAsync

        /// <summary>
        /// Inserts an audit record.
        /// </summary>
        /// <param name="auditRecord"></param>
        /// <returns></returns>
        public async Task<Audit> InsertAuditAsync(Audit auditRecord)
        {
            var insertedAudit = _dbContext.Audits.Add(auditRecord);

            await _dbContext.SaveChangesAsync();

            return insertedAudit;
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