using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OAuthServer.Models
{
    public class Client
    {
        [Key]
        [MaxLength(100)]
        public string ClientId { get; set; }
        [Required]
        public string Secret { get; set; }
        [MaxLength(100)]
        public string Description { get; set; }
        public ApplicationTypes ApplicationType { get; set; }
        public bool Active { get; set; }
        public int AccessTokenExpireTime { get; set; } /* In minutes */
        public int RefreshTokenLifeTime { get; set; } /* In minutes */
        [MaxLength(100)]
        public string AllowedOrigin { get; set; }

        public virtual ICollection<UserClient> Users { get; set; }
    }
}