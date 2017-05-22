using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using OAuthServer.Models;
using OAuthServer.ViewModels;
using Microsoft.AspNet.Identity;

namespace OAuthServer.Services
{
    public interface IUserService : IDisposable
    {
        Task<IEnumerable<UserViewModel>> GetUsersAsync();
        Task<UserViewModel> GetUserAsync(string userName, string password, string clientId = null);
        Task<UserViewModel> GetUserByIdAsync(string userId);
        Task<UserViewModel> GetUserByNameAsync(string userName);
        User InsertUser(UserViewModel userViewModel);
        Task<UserViewModel> InsertUserAsync(UserViewModel user);
        Task<UserViewModel> InsertUserAsync(User user, string password);
        Task<UserViewModel> InsertUserAsync(RegisterViewModel registerViewModel);
        Task<UserViewModel> UpdateUserAsync(UserViewModel userViewModel);
        Task<User> DeleteUserAsync(User user);
        Task<UserViewModel> DeleteUserAsync(string userId);
        Task<bool> UserExistsByIdAsync(string userId);
        Task<bool> UserExistsByNameAsync(string userName);
        Task<UsersSetupViewModel> GetUsersForSetupAsync();
    }

    public class UserService : IUserService
    {
        #region Private Attributes

        /// <summary>
        /// WebApiUsersDbContext object with the connection to database.
        /// </summary>
        private readonly OAuthServerDbContext _dbContext;

        /// <summary>
        /// UserManager object.
        /// </summary>
        private readonly ApplicationUserManager _userManager;

        /// <summary>
        /// ClientService object.
        /// </summary>
        private IClientService _clientService;

        /// <summary>
        /// ClientService object.
        /// </summary>
        private IRoleService _roleService;

        /// <summary>
        /// Track whether Dispose has been called. 
        /// </summary>
        private bool _disposed = false;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        public UserService(OAuthServerDbContext dbContext, ApplicationUserManager userManager, IClientService clientService, IRoleService roleService)
        {
            _dbContext = dbContext;
            _userManager = userManager;
            _clientService = clientService;
            _roleService = roleService;
        }

        #endregion

        #region GetUsersAsync

        /// <summary>
        /// Gets all users.
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<UserViewModel>> GetUsersAsync()
        {
            return await GetUsersInfoAsync();

            //return await _userManager.Users.OrderBy(u => u.UserName).ToListAsync();
        }

        #endregion

        #region GetUserAsync

        /// <summary>
        /// Gets a user by name, password and clientId.
        /// </summary>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <param name="clientId"></param>
        /// <returns></returns>
    public async Task<UserViewModel> GetUserAsync(string userName, string password, string clientId = null)
    {
        var user = await _userManager.FindAsync(userName, password);

        if (user == null || (clientId != null && user.Clients.Where(c => c.ClientId == clientId).Count() == 0))
        {
            return null;
        }

        return await GetUserByIdAsync(user.Id);
    }

        #endregion

        #region GetUserByIdAsync

        /// <summary>
        /// Gets a user by Id.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<UserViewModel> GetUserByIdAsync(string userId)
        {
            return (await GetUsersInfoAsync(userId: userId)).FirstOrDefault();
        }

        #endregion

        #region GetUserByName

        /// <summary>
        /// Gets a user by name.
        /// </summary>
        /// <param name="clientName"></param>
        /// <returns></returns>
        public User GetUserByName(string userName)
        {
            return _userManager.FindByName(userName);
        }

        #endregion

        #region GetUserByNameAsync

        /// <summary>
        /// Gets a user by name.
        /// </summary>
        /// <param name="clientName"></param>
        /// <returns></returns>
        public async Task<UserViewModel> GetUserByNameAsync(string userName)
        {
            return (await GetUsersInfoAsync(userName: userName)).FirstOrDefault();
        }

        #endregion

        #region InsertUser

        /// <summary>
        /// Inserts a user.
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public User InsertUser(User user)
        {
            _userManager.Create(user);

            return GetUserByName(user.UserName);
        }

        /// <summary>
        /// Inserts a user.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public User InsertUser(User user, string password)
        {
            _userManager.Create(user, password);

            return GetUserByName(user.UserName);
        }

        /// <summary>
        /// Inserts a user.
        /// </summary>
        /// <param name="userViewModel"></param>
        /// <returns></returns>
        public User InsertUser(UserViewModel userViewModel)
        {
            var result = _userManager.Create(new User
                                             {
                                                 UserName = userViewModel.UserName,
                                                 Email = userViewModel.Email,
                                                 LockoutEnabled = !userViewModel.IsActive
                                             },
                                             userViewModel.Password);

            if (result.Succeeded)
            {
                var createdUser = _userManager.FindByName(userViewModel.UserName);

                if (userViewModel.Role != null && !string.IsNullOrEmpty(userViewModel.Role.Name))
                {
                    _userManager.AddToRole(createdUser.Id, userViewModel.Role.Name);
                }

                if (userViewModel.Client != null && !string.IsNullOrEmpty(userViewModel.Client.ClientId))
                {
                    _dbContext.UserClients.Add(new UserClient { UserId = createdUser.Id, ClientId = userViewModel.Client.ClientId });
                    _dbContext.SaveChanges();
                }

                return createdUser;
            }

            return null;
        }

        #endregion

        #region InsertUserAsync

        /// <summary>
        /// Inserts a user.
        /// </summary>
        /// <param name="userViewModel"></param>
        /// <returns></returns>
        public async Task<UserViewModel> InsertUserAsync(UserViewModel userViewModel)
        {
            var result = await _userManager.CreateAsync(new User
                                                        {
                                                            UserName = userViewModel.UserName,
                                                            Email = userViewModel.Email,
                                                            LockoutEnabled = !userViewModel.IsActive
                                                        },
                                                        userViewModel.Password);

            if (result.Succeeded)
            {
                var createdUser = await _userManager.FindByNameAsync(userViewModel.UserName);

                if (userViewModel.Role != null && !string.IsNullOrEmpty(userViewModel.Role.Name))
                {
                    await _userManager.AddToRoleAsync(createdUser.Id, userViewModel.Role.Name);
                }

                if (userViewModel.Client != null && !string.IsNullOrEmpty(userViewModel.Client.ClientId))
                {
                    _dbContext.UserClients.Add(new UserClient { UserId = createdUser.Id, ClientId = userViewModel.Client.ClientId });
                    await _dbContext.SaveChangesAsync();
                }
            }

            return await GetUserByNameAsync(userViewModel.UserName);
        }

        /// <summary>
        /// Inserts a user.
        /// </summary>
        /// <param name="user"></param>
        /// <param name="password"></param>
        /// <returns></returns>
        public async Task<UserViewModel> InsertUserAsync(User user, string password)
        {
            await _userManager.CreateAsync(user, password);

            return await GetUserByNameAsync(user.UserName);
        }


        /// <summary>
        /// Inserts a user.
        /// </summary>
        /// <param name="registerViewModel"></param>
        /// <returns></returns>
        public async Task<UserViewModel> InsertUserAsync(RegisterViewModel registerViewModel)
        {
            User userToInsert = new User(registerViewModel.UserName);

            return await InsertUserAsync(userToInsert, registerViewModel.Password);
        }

        #endregion

        #region UpdateUserAsync

        /// <summary>
        /// Updates a user.
        /// </summary>
        /// <param name="userViewModel"></param>
        /// <returns></returns>
        public async Task<UserViewModel> UpdateUserAsync(UserViewModel userViewModel)
        {
            // Get user from database
            var userToUpdate = await _userManager.FindByIdAsync(userViewModel.UserId);

            // Change fields received in user variable.
            userToUpdate.UserName = userViewModel.UserName;
            userToUpdate.Email = userViewModel.Email;
            userToUpdate.LockoutEnabled = !userViewModel.IsActive;

            // Update roles
            var selectedRoles = new string[] { userViewModel.Role.Name };
            var userRoles = await _userManager.GetRolesAsync(userToUpdate.Id);

            // Add new roles
            await _userManager.AddToRolesAsync(userToUpdate.Id, selectedRoles.Except(userRoles).ToArray<string>());
            // Remove deleted roles
            await _userManager.RemoveFromRolesAsync(userToUpdate.Id, userRoles.Except(selectedRoles).ToArray<string>());

            // Update clients
            var selectedClients = new UserClient[] { new UserClient { UserId = userViewModel.UserId, ClientId = userViewModel.Client.ClientId } };
            var userClients = await _dbContext.UserClients.Where(uc => uc.UserId == userViewModel.UserId).ToListAsync();

            // Add new clients
            foreach (var clientToAdd in selectedClients.Except(userClients))
            {
                _dbContext.UserClients.Add(clientToAdd);
            }

            // Remove deleted clients
            foreach (var clientToRemove in userClients.Except(selectedClients))
            {
                _dbContext.UserClients.Attach(clientToRemove);
                _dbContext.Entry(clientToRemove).State = EntityState.Deleted;
            }

            // If the user is inactive, delete all tokens in RefreshTokens for this user
            if (userToUpdate.LockoutEnabled)
            {
                _dbContext.RefreshTokens.RemoveRange(_dbContext.RefreshTokens.Where(rt => rt.UserId == userToUpdate.Id));
            }

            // Update the user
            await _userManager.UpdateAsync(userToUpdate);
            // Save changes
            await _dbContext.SaveChangesAsync();

            return await GetUserByIdAsync(userViewModel.UserId);
        }

        #endregion

        #region DeleteUserAsync

        /// <summary>
        /// Deletes a user.
        /// </summary>
        /// <param name="user"></param>
        /// <returns></returns>
        public async Task<User> DeleteUserAsync(User user)
        {
            await _userManager.DeleteAsync(user);

            return user;
        }

        /// <summary>
        /// Deletes a user by id.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<UserViewModel> DeleteUserAsync(string userId)
        {
            var deletedUser2return = await GetUserByIdAsync(userId);

            var user2delete = await _userManager.FindByIdAsync(userId);

            await _userManager.DeleteAsync(user2delete);

            return deletedUser2return;
        }

        #endregion

        #region UserExistsByNameAsync

        /// <summary>
        /// Checks if a user name already exists.
        /// </summary>
        /// <param name="userName"></param>
        /// <returns></returns>
        public async Task<bool> UserExistsByNameAsync(string userName)
        {
            return ((await _userManager.Users.CountAsync(u => u.UserName == userName)) > 0);
        }

        #endregion

        #region UserExistsByIdAsync

        /// <summary>
        /// Checks if a user id already exists.
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<bool> UserExistsByIdAsync(string userId)
        {
            return (await _userManager.Users.CountAsync(u => u.Id == userId) > 0);
        }

        #endregion

        #region GetUsersForSetupAsync

        /// <summary>
        /// Gets all users for setup.
        /// </summary>
        /// <returns></returns>
        public async Task<UsersSetupViewModel> GetUsersForSetupAsync()
        {
            return new UsersSetupViewModel
            {
                Users = await GetUsersAsync(),
                Clients = await _clientService.GetClientsAsync(),
                Roles = await _roleService.GetRolesAsync()
            };
        }

        #endregion

        #region Private Methods

        #region GetUsersInfoAsync

        /// <summary>
        /// Gets users from User table with theirs client and role info.
        /// If userId and userName are null, gets all users.
        /// If userId is not null, gets user by id.
        /// If userId is null and userName is not null, gets user by name.
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="userName"></param>
        /// <returns></returns>
        private async Task<IEnumerable<UserViewModel>> GetUsersInfoAsync(string userId = null, string userName = null)
        {
            // We are going to limit a user to have one client and one role. This limit is achieved using 'FirstOrDefault()' in joins in following query:
            return await (from user in _dbContext.Users
                          join role in _dbContext.Roles
                              on user.Roles.FirstOrDefault().RoleId equals role.Id into r
                          from role in r.DefaultIfEmpty()  // left join
                          join client in _dbContext.Clients
                              on user.Clients.FirstOrDefault().ClientId equals client.ClientId into c
                          from client in c.DefaultIfEmpty() // left join
                          orderby user.UserName
                          where user.Id == userId || (userId == null && (user.UserName == userName || userName == null))
                          select new UserViewModel
                          {
                              UserId = user.Id,
                              UserName = user.UserName,
                              Email = user.Email,
                              IsActive = !user.LockoutEnabled,
                              Client = new ClientViewModel
                              {
                                  ClientId = client.ClientId,
                                  Secret = client.Secret,
                                  Description = client.Description,
                                  ApplicationType = client != null ? new ApplicationType { Id = (int)client.ApplicationType, Description = client.ApplicationType.ToString() } : null,
                                  IsActive = client != null ? client.Active : false,
                                  RefreshTokenLifeTime = client != null ? client.RefreshTokenLifeTime : 0,
                                  AllowedOrigin = client.AllowedOrigin
                              },
                              Role = new RoleViewModel { Id = role.Id, Name = role.Name }
                          }).ToListAsync();
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

                    //if (_userStore != null)
                    //{
                    //    _userStore.Dispose();
                    //}

                    //if (_userManager != null)
                    //{
                    //    _userManager.Dispose();
                    //}
                }

                _disposed = true;
            }
        }

        #endregion
    }
}