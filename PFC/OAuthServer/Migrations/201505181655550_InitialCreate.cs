namespace AuthServer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Audits",
                c => new
                    {
                        AuditId = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClientId = c.String(nullable: false, maxLength: 100),
                        Url = c.String(nullable: false, maxLength: 2000),
                        InternalUrl = c.String(nullable: false, maxLength: 2000),
                        HttpMethod = c.String(nullable: false, maxLength: 10),
                        AuditUtc = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.AuditId)
                .ForeignKey("dbo.Clients", t => t.ClientId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.ClientId);
            
            CreateTable(
                "dbo.Clients",
                c => new
                    {
                        ClientId = c.String(nullable: false, maxLength: 100),
                        Secret = c.String(nullable: false),
                        Description = c.String(maxLength: 100),
                        ApplicationType = c.Int(nullable: false),
                        Active = c.Boolean(nullable: false),
                        AccessTokenExpireTime = c.Int(nullable: false),
                        RefreshTokenLifeTime = c.Int(nullable: false),
                        AllowedOrigin = c.String(maxLength: 100),
                    })
                .PrimaryKey(t => t.ClientId);
            
            CreateTable(
                "dbo.UserClients",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClientId = c.String(nullable: false, maxLength: 100),
                    })
                .PrimaryKey(t => new { t.UserId, t.ClientId })
                .ForeignKey("dbo.Clients", t => t.ClientId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.ClientId);
            
            CreateTable(
                "dbo.AspNetUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.AspNetUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserLogins",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.AspNetUserRoles",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetRoles", t => t.RoleId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.RefreshTokens",
                c => new
                    {
                        RefreshTokenId = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                        UserName = c.String(nullable: false, maxLength: 256),
                        ClientId = c.String(nullable: false, maxLength: 100),
                        IssuedUtc = c.DateTime(nullable: false),
                        ExpiresUtc = c.DateTime(nullable: false),
                        ProtectedTicket = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.RefreshTokenId)
                .ForeignKey("dbo.Clients", t => t.ClientId, cascadeDelete: true)
                .ForeignKey("dbo.AspNetUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.ClientId);
            
            CreateTable(
                "dbo.AspNetRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.AspNetUserRoles", "RoleId", "dbo.AspNetRoles");
            DropForeignKey("dbo.RefreshTokens", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.RefreshTokens", "ClientId", "dbo.Clients");
            DropForeignKey("dbo.Audits", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserRoles", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserLogins", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.UserClients", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.AspNetUserClaims", "UserId", "dbo.AspNetUsers");
            DropForeignKey("dbo.Audits", "ClientId", "dbo.Clients");
            DropForeignKey("dbo.UserClients", "ClientId", "dbo.Clients");
            DropIndex("dbo.AspNetRoles", "RoleNameIndex");
            DropIndex("dbo.RefreshTokens", new[] { "ClientId" });
            DropIndex("dbo.RefreshTokens", new[] { "UserId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "RoleId" });
            DropIndex("dbo.AspNetUserRoles", new[] { "UserId" });
            DropIndex("dbo.AspNetUserLogins", new[] { "UserId" });
            DropIndex("dbo.AspNetUserClaims", new[] { "UserId" });
            DropIndex("dbo.AspNetUsers", "UserNameIndex");
            DropIndex("dbo.UserClients", new[] { "ClientId" });
            DropIndex("dbo.UserClients", new[] { "UserId" });
            DropIndex("dbo.Audits", new[] { "ClientId" });
            DropIndex("dbo.Audits", new[] { "UserId" });
            DropTable("dbo.AspNetRoles");
            DropTable("dbo.RefreshTokens");
            DropTable("dbo.AspNetUserRoles");
            DropTable("dbo.AspNetUserLogins");
            DropTable("dbo.AspNetUserClaims");
            DropTable("dbo.AspNetUsers");
            DropTable("dbo.UserClients");
            DropTable("dbo.Clients");
            DropTable("dbo.Audits");
        }
    }
}
