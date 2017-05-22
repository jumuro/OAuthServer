using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OAuthServer.Models
{
    public class RefreshToken
    {
        [Key]
        public string RefreshTokenId { get; set; }
        [Required]
        [MaxLength(256)]
        public string UserId { get; set; }
        [Required]
        [MaxLength(256)]
        public string UserName { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        [Required]
        [MaxLength(100)]
        public string ClientId { get; set; }
        [ForeignKey("ClientId")]
        public virtual Client Client { get; set; }
        public DateTime IssuedUtc { get; set; }
        public DateTime ExpiresUtc { get; set; }
        [Required]
        public string ProtectedTicket { get; set; }
    }
}