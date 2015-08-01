using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using OAuthServer.Filters.Attributes;
using OAuthServer.Services;
using OAuthServer.ViewModels;
using Jumuro.WebApi.Extensions;
using Jumuro.WebApi.Extensions.ActionResults;

namespace OAuthServer.Controllers
{
    //[ApplicationAuthorize(Roles = "Admin")]
    [RoutePrefix("api/authserver/roles")]
    public class RoleController : ApiController
    {
        #region Private Attributes

        private readonly IRoleService _roleService;

        #endregion

        #region Constructor

        public RoleController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        #endregion

        #region GetRolesAsync

        /// <summary>
        /// Gets all roles.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetRolesAsync()
        {
            var oRoles = await _roleService.GetRolesAsync();

            return Ok<IEnumerable<RoleViewModel>>(oRoles);
        }

        #endregion

        #region GetRoleByIdAsync

        [HttpGet]
        [Route("{roleId}")]
        public async Task<IHttpActionResult> GetRoleByIdAsync(string roleId)
        {
            var role = await _roleService.GetRoleByIdAsync(roleId);

            if (role == null)
            {
                return this.NotFound(string.Format("Role with Id '{0}' not found.", roleId));
            }

            return Ok<RoleViewModel>(role);
        }

        #endregion

        #region GetRoleByNameAsync

        [HttpGet]
        [Route("name/{roleName}")]
        public async Task<IHttpActionResult> GetRoleByNameAsync(string roleName)
        {
            var oRole = await _roleService.GetRoleByNameAsync(roleName);

            if (oRole == null)
            {
                return this.NotFound(string.Format("Role with name '{0}' not found.", roleName));
            }

            return Ok<RoleViewModel>(oRole);
        }

        #endregion

        #region PostRoleAsync

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> PostRoleAsync([FromBody]RoleViewModel roleViewModel)
        {
            if (!ModelState.IsValid)
            {
                return new ModelStateErrorResult(ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray(), Request);
            }

            if (_roleService.RoleExistsByName(roleViewModel.Name))
            {
                return this.Conflict(string.Format("A role with the name '{0}' already exists.", roleViewModel.Name));
            }

            var insertedRole = await _roleService.InsertRoleAsync(roleViewModel);

            return this.Created<RoleViewModel>(Request.RequestUri, insertedRole, "Role created successfully.");
        }

        #endregion

        #region PutRoleAsync

        /// <summary>
        /// Updates a role.
        /// </summary>
        /// <param name="role"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("")]
        public async Task<IHttpActionResult> PutRoleAsync([FromBody]RoleViewModel roleViewModel)
        {
            if (!ModelState.IsValid)
            {
                return new ModelStateErrorResult(ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray(), Request);
            }

            if (!_roleService.RoleExistsById(roleViewModel.Id))
            {
                return this.NotFound(string.Format("A role with the id '{0}' does not exist.", roleViewModel.Id));
            }

            var updatedRole = await _roleService.UpdateRoleAsync(roleViewModel);

            return this.Ok<RoleViewModel>(updatedRole, "Role updated successfully.");
        }

        #endregion

        #region DeleteRoleAsync

        /// <summary>
        /// Deletes a role.
        /// </summary>
        /// <param name="roleiD"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{roleId}")]
        public async Task<IHttpActionResult> DeleteRoleAsync(string roleId)
        {
            if (!_roleService.RoleExistsById(roleId))
            {
                return this.NotFound(string.Format("The role does not exist.", roleId));
            }

            if (await _roleService.RoleHasAssociatedUsersAsync(roleId))
            {
                return this.Conflict(string.Format("The role has associated users.", roleId));
            }

            var deletedRole = await _roleService.DeleteRoleAsync(roleId);

            return this.Ok<RoleViewModel>(deletedRole, "Role deleted successfully.");
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
                //if (_roleService != null)
                //{
                //    _roleService.Dispose();
                //}
            }

            base.Dispose(disposing);
        }

        #endregion
    }
}
