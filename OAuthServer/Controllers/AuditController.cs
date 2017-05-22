using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using OAuthServer.Models;
using OAuthServer.Services;
using OAuthServer.ViewModels;
using Jumuro.WebApi.Extensions;
using Jumuro.WebApi.Extensions.ActionResults;

namespace OAuthServer.Controllers
{
    [RoutePrefix("api/authserver/audits")]
    public class AuditController : ApiController
    {
        #region Private Attributes

        private readonly IAuditService _auditService;
        
        #endregion

        #region Constructor

        public AuditController(IAuditService auditService)
        {
            _auditService = auditService;
        }

        #endregion

        #region PostAuditAsync

        /// <summary>
        /// Inserts an audit record.
        /// </summary>
        /// <param name="auditRecord"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> PostAuditAsync([FromBody] Audit auditRecord)
        {
            if (!ModelState.IsValid)
            {
                return new ModelStateErrorResult(ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray(), Request);
            }

            var insertedAudit = await _auditService.InsertAuditAsync(auditRecord);

            return this.Created<Audit>(Request.RequestUri, insertedAudit, "Audit record created successfully.");
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
                //if (_auditService != null)
                //{
                //    _auditService.Dispose();
                //}
            }

            base.Dispose(disposing);
        }

        #endregion
    }
}
