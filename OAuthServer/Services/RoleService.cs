using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using OAuthServer.Models;
using OAuthServer.ViewModels;
using Microsoft.AspNet.Identity.EntityFramework;

namespace OAuthServer.Services
{
    public interface IRoleService : IDisposable
    {
        Task<IEnumerable<RoleViewModel>> GetRolesAsync();
        Task<RoleViewModel> GetRoleByIdAsync(string roleId);
        Task<RoleViewModel> GetRoleByNameAsync(string roleName);
        Task<RoleViewModel> InsertRoleAsync(RoleViewModel roleViewModel);
        Task<RoleViewModel> UpdateRoleAsync(RoleViewModel roleViewModel);
        Task<RoleViewModel> DeleteRoleAsync(string roleId);
        bool RoleExistsById(string roleId);
        bool RoleExistsByName(string roleName);
        Task<bool> RoleHasAssociatedUsersAsync(string roleId);
    }

    public class RoleService : IRoleService
    {
        #region Private Attributes

        /// <summary>
        /// WebApiUsersDbContext object with the connection to database.
        /// </summary>
        private readonly OAuthServerDbContext _dbContext;

        /// <summary>
        /// RoleManager object.
        /// </summary>
        private readonly ApplicationRoleManager _roleManager;

        /// <summary>
        /// UserManager object.
        /// </summary>
        private readonly ApplicationUserManager _userManager;

        /// <summary>
        /// Track whether Dispose has been called. 
        /// </summary>
        private bool _disposed = false;

        #endregion

        #region Constructor

        /// <summary>
        /// Constructor
        /// </summary>
        public RoleService(OAuthServerDbContext dbContext, ApplicationRoleManager roleManager, ApplicationUserManager userManager)
        {
            _dbContext = dbContext;
            _roleManager = roleManager;
            _userManager = userManager;
        }

        #endregion

        #region GetRoleByIdAsync

        /// <summary>
        /// Gets a role by Id.
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        public async Task<RoleViewModel> GetRoleByIdAsync(string roleId)
        {
            var role = await _roleManager.FindByIdAsync(roleId);

            return new RoleViewModel { Id = role.Id, Name = role.Name };
        }

        #endregion

        #region GetRoleByNameAsync

        /// <summary>
        /// Gets a role by name.
        /// </summary>
        /// <param name="clientName"></param>
        /// <returns></returns>
        public async Task<RoleViewModel> GetRoleByNameAsync(string roleName)
        {
            var role = await _roleManager.FindByNameAsync(roleName);

            return new RoleViewModel { Id = role.Id, Name = role.Name };
        }

        #endregion

        #region GeRolesAsync

        /// <summary>
        /// Gets all roles.
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<RoleViewModel>> GetRolesAsync()
        {
            var roles = await _roleManager.Roles.OrderBy(r => r.Name).ToListAsync();

            return (from r in roles
                    select new RoleViewModel { Id = r.Id, Name = r.Name }
                   ).ToList();
        }

        #endregion

        #region InsertRoleAsync

        /// <summary>
        /// Inserts a role.
        /// </summary>
        /// <param name="roleViewModel"></param>
        /// <returns></returns>
        public async Task<RoleViewModel> InsertRoleAsync(RoleViewModel roleViewModel)
        {
            await _roleManager.CreateAsync(new IdentityRole(roleViewModel.Name));

            return await GetRoleByNameAsync(roleViewModel.Name);
        }

        #endregion

        #region UpdateRoleAsync

        ///// <summary>
        ///// Updates a role.
        ///// </summary>
        ///// <param name="role"></param>
        ///// <returns></returns>
        //public async Task<IdentityRole> UpdateRoleAsync(IdentityRole role)
        //{
        //    // Get role from database
        //    var roleToUpdate = await GetRoleByIdAsync(role.Id);

        //    // Change fields received in role variable.

        //    //TODO: Pending to review the fields to update depending on the form fields.
        //    roleToUpdate.Name = role.Name;

        //    roleToUpdate.Users.Clear();

        //    foreach (IdentityUserRole userRole in role.Users)
        //    {
        //        roleToUpdate.Users.Add(userRole);
        //    }

        //    // Update the role
        //    await _roleManager.UpdateAsync(roleToUpdate);

        //    return await GetRoleByIdAsync(role.Id);
        //}

        ///// <summary>
        ///// Updates a role.
        ///// </summary>
        ///// <param name="role"></param>
        ///// <returns></returns>
        //public async Task<IdentityRole> UpdateRoleAsync(IdentityRole role)
        //{
        //    // Get role from database
        //    var roleToUpdate = await GetRoleByIdAsync(role.Id);

        //    // Change fields received in role variable.

        //    //TODO: Pending to review the fields to update depending on the form fields.
        //    roleToUpdate.Name = role.Name;

        //    var deletedUsers = roleToUpdate.Users.Where(u => !role.Users.Any(u2 => u2.UserId == u.UserId));
        //    var addedUsers = role.Users.Where(u => !roleToUpdate.Users.Any(u2 => u2.UserId == u.UserId));

        //    foreach (IdentityUserRole userRole in deletedUsers)
        //    {
        //        //await _userManager.RemoveFromRoleAsync(userRole.UserId, userRole.RoleId);
        //        roleToUpdate.Users.Remove(userRole);
        //    }

        //    foreach (IdentityUserRole userRole in addedUsers)
        //    {
        //        //await _userManager.AddToRoleAsync(userRole.UserId, userRole.RoleId);
        //        roleToUpdate.Users.Add(userRole);
        //    }

        //    // Update the role
        //    await _roleManager.UpdateAsync(roleToUpdate);

        //    return await GetRoleByIdAsync(role.Id);
        //}

        /// <summary>
        /// Updates a role.
        /// </summary>
        /// <param name="roleViewModel"></param>
        /// <returns></returns>
        public async Task<RoleViewModel> UpdateRoleAsync(RoleViewModel roleViewModel)
        {
            // Get the role from database
            var role2Update = await _roleManager.FindByIdAsync(roleViewModel.Id);
            
            // Change fields received in roleViewModel variable.
            role2Update.Name = roleViewModel.Name;

            // Update the role
            await _roleManager.UpdateAsync(role2Update);

            return await GetRoleByIdAsync(roleViewModel.Id);
        }

        #endregion

        #region DeleteRoleAsync

        /// <summary>
        /// Deletes a role by id.
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        public async Task<RoleViewModel> DeleteRoleAsync(string roleId)
        {
            var role2Delete = await _roleManager.FindByIdAsync(roleId);

            var deletedRole = await _roleManager.DeleteAsync(role2Delete);

            return new RoleViewModel { Id = role2Delete.Id, Name = role2Delete.Name };
        }

        #endregion

        #region RoleExistsByName

        /// <summary>
        /// Checks if a role name already exists.
        /// </summary>
        /// <param name="roleName"></param>
        /// <returns></returns>
        public bool RoleExistsByName(string roleName)
        {
            return (_roleManager.Roles.Count(r => r.Name == roleName) > 0);
        }

        #endregion

        #region RoleExistsById

        /// <summary>
        /// Checks if a role id already exists.
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        public bool RoleExistsById(string roleId)
        {
            return (_roleManager.Roles.Count(r => r.Id == roleId) > 0);
        }

        #endregion

        #region RoleHasAssociatedUsersAsync

        /// <summary>
        /// Checks if a cliroleent has associated users.
        /// </summary>
        /// <param name="roleId"></param>
        /// <returns></returns>
        public async Task<bool> RoleHasAssociatedUsersAsync(string roleId)
        {
            var role = await _roleManager.FindByIdAsync(roleId);
            return (role.Users.Count > 0);
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

                    //if (_roleManager != null)
                    //{
                    //    _roleManager.Dispose();
                    //}
                }

                _disposed = true;
            }
        }

        #endregion
    }
}