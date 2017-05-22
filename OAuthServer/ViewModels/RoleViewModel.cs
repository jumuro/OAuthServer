using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity.EntityFramework;

namespace OAuthServer.ViewModels
{
    public class RoleViewModel
    {
        #region Constructors

        public RoleViewModel() { }

        public RoleViewModel(IdentityRole role)
        {
            if (role != null)
            {
                Id = role.Id;
                Name = role.Name;
            }
        }

        #endregion

        #region Properties

		public string Id { get; set; }
        [Required(AllowEmptyStrings = false)]
        [MaxLength(128)]
        [Display(Name = "RoleName")]
        public string Name { get; set; }

	    #endregion
    }
}