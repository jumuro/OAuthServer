﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OAuthServer.Constants
{
    public static class Paths
    {
        ///// <summary>
        ///// AuthorizationServer project should run on this URL
        ///// </summary>
        //public const string AuthorizationServerBaseAddress = "http://localhost:11625";

        ///// <summary>
        ///// ResourceServer project should run on this URL
        ///// </summary>
        //public const string ResourceServerBaseAddress = "http://localhost:38385";

        ///// <summary>
        ///// ImplicitGrant project should be running on this specific port '38515'
        ///// </summary>
        //public const string ImplicitGrantCallBackPath = "http://localhost:38515/Home/SignIn";

        ///// <summary>
        ///// AuthorizationCodeGrant project should be running on this URL.
        ///// </summary>
        //public const string AuthorizeCodeCallBackPath = "http://localhost:38500/";

        //public const string AuthorizePath = "/OAuth/Authorize";
        public const string TokenPath = "/token";
        public const string LoginPath = "/Account/Login";
        public const string LogoutPath = "/Account/Logout";
        //public const string MePath = "/api/Me";
    }
}