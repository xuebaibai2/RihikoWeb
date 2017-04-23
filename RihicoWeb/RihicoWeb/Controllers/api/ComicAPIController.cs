using RihicoWeb.Application;
using RihicoWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Script.Serialization;
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

        public async Task<dynamic> GetUrlContent(string url)
        {
            using (WebClient wc = new WebClient())
            {
                wc.Headers.Add("User-Agent", CONSTVALUE.USER_AGENT);
                wc.Headers.Add("Content-Type", CONSTVALUE.HTML_CONTENT_TYPE);
                try
                {
                    return await wc.DownloadStringTaskAsync(new Uri(url));
                }
                catch (Exception ex)
                {
                    return ex;
                }
            }
        }

        public async Task GetDownloadImgAsync(string imgSrcListJson)
        {
            var comicList = new JavaScriptSerializer().Deserialize<List<Comic>>(imgSrcListJson);
            
            using (WebClient wc = new WebClient())
            {
                wc.Headers.Add("User-Agent", CONSTVALUE.USER_AGENT);
                wc.Headers.Add("Content-Type", CONSTVALUE.IMG_CONTENT_TYPE);
                try
                {
                    foreach (Comic comic in comicList)
                    {
                        await wc.DownloadFileTaskAsync(comic.Url, @"I:\images\"+ comic.Title + "\\" + comic.Page + ".jpg");
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                    //return ex;
                }
            }
        }
    }
}
