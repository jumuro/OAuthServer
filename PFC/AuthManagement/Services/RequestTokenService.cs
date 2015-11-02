//using System;
//using System.Collections.Generic;
//using System.Configuration;
//using System.Linq;
//using System.Web;
//using System.Net.Http;
//using System.Net.Http.Headers;

//namespace Espa.Angular.Services
//{
//    public class RequestTokenService
//    {
//        private readonly string _user;
//        private readonly string _pwd;
//        private readonly string _clientId;
//        private readonly string _serverUrl;
//        private readonly string _cookieName;

//        public RequestTokenService()
//        {
//            _user = ConfigurationManager.AppSettings["OAuthUser"];
//            _pwd = ConfigurationManager.AppSettings["OAuthPwd"];
//            _clientId = ConfigurationManager.AppSettings["OAuthClientId"];
//            _serverUrl = ConfigurationManager.AppSettings["OAuthURL"];
//        }

//        public string GetAuthenticationTicket()
//        {
//            using (var client = new HttpClient())
//            {
//                var postData = new List<KeyValuePair<string, string>>();
//                postData.Add(new KeyValuePair<string, string>("username", _user));
//                postData.Add(new KeyValuePair<string, string>("password", _pwd));
//                postData.Add(new KeyValuePair<string, string>("grant_type", "password"));
//                postData.Add(new KeyValuePair<string, string>("client_id", _clientId));

//                HttpContent content = new FormUrlEncodedContent(postData);
//                content.Headers.ContentType = new MediaTypeHeaderValue("application/x-www-form-urlencoded");

//                var responseResult = client.PostAsync(_serverUrl, content).Result;

//                return responseResult.Content.ReadAsStringAsync().Result;
//            }
//        }
//    }
//}