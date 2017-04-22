using RihicoWeb.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace RihicoWeb.Controllers.api
{
    [PluginController("webAPI")]
    public class ComicAPIController : MasterAPIController
    {
        [HttpGet]
        public IEnumerable<string> GetAllComic()
        {
            return new[] { "One Piece", "Naruto", "Bleech" };
        }

        public async Task<string> GetUrlContent(string url)
        {
            using (WebClient wc = new WebClient())
            {
                wc.Headers.Add("User-Agent", CONSTVALUE.USER_AGENT);
                wc.Headers.Add("Content-Type", CONSTVALUE.CONTENT_TYPE);
                try
                {

                    return await wc.DownloadStringTaskAsync(new Uri(url));
                }
                catch (Exception ex)
                {
                    return ex.Message;
                }
            }
        }
    }
}
