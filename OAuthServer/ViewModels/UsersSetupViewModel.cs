using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace OAuthServer.ViewModels
{
    public class UsersSetupViewModel
    {
        public IEnumerable<UserViewModel> Users;
        public IEnumerable<ClientViewModel> Clients;
        public IEnumerable<RoleViewModel> Roles;
    }

    public class UserViewModel
    {
        public UserViewModel() { }
        public UserViewModel(string userId, string userName, string email, bool isActive, ClientViewModel client)
        {
            UserId = userId;
            UserName = userName;
            Email = email;
            IsActive = isActive;
            Client = client;
        }
        public string UserId { get; set; }
        [Required]
        [MaxLength(256)]
        public string UserName { get; set; }

        [StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        [MaxLength(256)]
        public string Email { get; set; }
        public bool IsActive { get; set; }
        [Required]
        public ClientViewModel Client { get; set; }
        [Required]
        public RoleViewModel Role { get; set; }
    }
}