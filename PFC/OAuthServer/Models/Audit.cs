using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OAuthServer.Models
{
    public class Audit
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int AuditId { get; set; }
        [Required]
        [MaxLength(256)]
        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        [Required]
        [MaxLength(100)]
        public string ClientId { get; set; }
        [ForeignKey("ClientId")]
        public virtual Client Client { get; set; }
        [Required]
        [MaxLength(2000)]
        public string Url { get; set; }
        [Required]
        [MaxLength(2000)]
        public string InternalUrl { get; set; }
        [Required]
        [MaxLength(10)]
        public string HttpMethod { get; set; }
        [Required]
        public DateTime AuditUtc { get; set; }
    }
}