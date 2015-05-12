//using System;
//using System.Configuration;
//using System.Security.Principal;
//using System.Text;
//using System.Threading.Tasks;
//using System.Web.Http.ExceptionHandling;
//using Espa.General;

//namespace OAuthServer.Tracing
//{
//    public class LogException : ExceptionLogger
//    {
//        public override Task LogAsync(ExceptionLoggerContext context, System.Threading.CancellationToken cancellationToken)
//        {
//            var oESPA_Mail = new ESPA_Mail();

//            oESPA_Mail.Subject = string.Format("Web Api {0}", ConfigurationManager.AppSettings["appName"]);
//            oESPA_Mail.IsHtml = false;
//            oESPA_Mail.Body = this.CreateBody(context);

//            oESPA_Mail.SendEmail();

//            return base.LogAsync(context, cancellationToken);
//        }

//        private string CreateBody(ExceptionLoggerContext context)
//        {
//            string sRequestUri = context.Request.RequestUri.ToString();

//            StringBuilder sBody = new StringBuilder();

//            sBody.AppendFormat("URL:       {0}", sRequestUri);
//            sBody.AppendFormat("\r\n\r\nUser:      {0}", this.GetUserLogon(context.RequestContext.Principal.Identity));
//            sBody.AppendFormat("\r\n\r\nDATE:     {0}", DateTime.Now.ToShortTimeString());

//            sBody.AppendFormat(this.FormatBody(sRequestUri, context.Exception));

//            return sBody.ToString();
//        }

//        private string GetUserLogon(IIdentity oIdentity)
//        {
//            var aIdentity = oIdentity.Name.Split('\\');
//            string sUserLogon = aIdentity.Length > 1 ? aIdentity[1] : string.Empty;
//            return sUserLogon;
//        }

//        private string FormatBody(string sRequestUri, Exception context)
//        {
//            StringBuilder sBody = new StringBuilder();

//            if (context.InnerException != null)
//            {
//                return FormatBody(sRequestUri, context.InnerException);
//            }
//            else
//            {
//                sBody.AppendLine("*******************INNER EXCEPTION********************************");
//                sBody.AppendFormat("\r\n\r\nMESSAGE:      {0}", context.Message);
//                sBody.AppendFormat("\r\n\r\n\r\n\r\nTRACE:\r\n      {0}", context.StackTrace != null ? context.StackTrace.ToString() : string.Empty);
//                sBody.AppendFormat("\r\n\r\n\r\n\r\nSOURCE:     {0}", context.Source != null ? context.Source.ToString() : string.Empty);

//                return sBody.ToString();
//            }
//        }
//    }
//}