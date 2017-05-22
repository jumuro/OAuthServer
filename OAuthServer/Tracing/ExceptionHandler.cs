using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http.ExceptionHandling;
using Jumuro.WebApi.Extensions.ActionResults;

namespace OAuthServer.Tracing
{
    public class GeneralException : ExceptionHandler
    {
        public override void Handle(ExceptionHandlerContext context)
        {
            context.Exception.GetType();

            var resp = new HttpResponseMessage(HttpStatusCode.InternalServerError)
            {
                Content = new StringContent(FormatException(context.Exception)),
                ReasonPhrase = "Exception"
            };

            context.Result = new ErrorMessageResult(context.Request, resp);
        }

        public override bool ShouldHandle(ExceptionHandlerContext context)
        {
            return true;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ex"></param>
        /// <returns></returns>
        private string FormatException(Exception ex)
        {
            StringBuilder exceptionMessage = new StringBuilder();

            if (ex.InnerException != null)
            {
                return FormatException(ex.InnerException);
            }

            exceptionMessage.Append(ex.Message);

            return exceptionMessage.ToString();
        }
    }
}