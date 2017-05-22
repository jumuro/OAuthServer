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
    [ApplicationAuthorize(Roles = "Admin")]
    [RoutePrefix("api/authserver/users")]
    public class UserController : ApiController
    {
        #region Private Attributes

        private readonly IUserService _userService;

        #endregion

        #region Constructor

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        #endregion

        #region GetUsersAsync

        /// <summary>
        /// Gets all users.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetUsersAsync()
        {
            var oUsers = await _userService.GetUsersAsync();

            return Ok<IEnumerable<UserViewModel>>(oUsers);
        }

        #endregion

        #region GetUserByIdAsync

        [HttpGet]
        [Route("{userId}")]
        public async Task<IHttpActionResult> GetUserByIdAsync(string userId)
        {
            var oUser = await _userService.GetUserByIdAsync(userId);

            if (oUser == null)
            {
                return this.NotFound(string.Format("User with Id '{0}' not found.", userId));
            }

            return Ok<UserViewModel>(oUser);
        }

        #endregion

        #region GetUserByNameAsync

        [HttpGet]
        [Route("name/{userName}")]
        public async Task<IHttpActionResult> GetUserByNameAsync(string userName)
        {
            var oUser = await _userService.GetUserByNameAsync(userName);

            if (oUser == null)
            {
                return this.NotFound(string.Format("User with name '{0}' not found.", userName));
            }

            return Ok<UserViewModel>(oUser);
        }

        #endregion

        #region RegisterUserAsync

        [Route("register")]
        [HttpPost]
        public async Task<IHttpActionResult> RegisterUserAsync(RegisterViewModel registerViewModel)
        {
            if (!ModelState.IsValid)
            {
                return new ModelStateErrorResult(ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray(), Request);
            }

            if (await _userService.UserExistsByNameAsync(registerViewModel.UserName))
            {
                return this.Conflict(string.Format("A user with the name '{0}' already exists.", registerViewModel.UserName));
            }

            var insertedUser = await _userService.InsertUserAsync(registerViewModel);

            return this.Created<UserViewModel>(Request.RequestUri, insertedUser, "User created successfully.");
        }

        #endregion

        #region PostUserAsync

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> PostUserAsync([FromBody]UserViewModel userViewModel)
        {
            if (!ModelState.IsValid)
            {
                return new ModelStateErrorResult(ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray(), Request);
            }

            if (await _userService.UserExistsByNameAsync(userViewModel.UserName))
            {
                return this.Conflict(string.Format("A user with the name '{0}' already exists.", userViewModel.UserName));
            }

            var insertedUser = await _userService.InsertUserAsync(userViewModel);

            return this.Created<UserViewModel>(Request.RequestUri, insertedUser, "User created successfully.");
        }

        #endregion

        #region PutUserAsync

        /// <summary>
        /// Updates a user.
        /// </summary>
        /// <param name="userViewModel"></param>
        /// <returns></returns>
        [HttpPut]
        [Route("")]
        public async Task<IHttpActionResult> PutUserAsync([FromBody]UserViewModel userViewModel)
        {
            if (!ModelState.IsValid)
            {
                return new ModelStateErrorResult(ModelState.Keys.SelectMany(k => ModelState[k].Errors).Select(m => m.ErrorMessage).ToArray(), Request);
            }

            if (!await _userService.UserExistsByIdAsync(userViewModel.UserId))
            {
                return this.NotFound(string.Format("A user with the id of '{0}' does not exist.", userViewModel.UserName));
            }

            var updatedUser = await _userService.UpdateUserAsync(userViewModel);

            return this.Ok<UserViewModel>(updatedUser, "User updated successfully.");
        }

        #endregion

        #region DeleteUserAsync

        /// <summary>
        /// Deletes a user.
        /// </summary>
        /// <param name="useriD"></param>
        /// <returns></returns>
        [HttpDelete]
        [Route("{userId}")]
        public async Task<IHttpActionResult> DeleteUserAsync(string userId)
        {
            if (!await _userService.UserExistsByIdAsync(userId))
            {
                return this.NotFound(string.Format("A user with the id '{0}' does not exist.", userId));
            }

            var deletedUser = await _userService.DeleteUserAsync(userId);

            return this.Ok<UserViewModel>(deletedUser, "User deleted successfully.");
        }

        #endregion

        #region GetUsersForSetupAsync

        /// <summary>
        /// Gets all users for setup.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("setup")]
        public async Task<IHttpActionResult> GetUsersForSetupAsync()
        {
            var users = await _userService.GetUsersForSetupAsync();

            return Ok<UsersSetupViewModel>(users);
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
                //if (_userService != null)
                //{
                //    _userService.Dispose();
                //}
            }

            base.Dispose(disposing);
        }

        #endregion
    }
}
