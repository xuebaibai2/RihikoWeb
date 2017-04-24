using RihicoWeb.Application;
using RihicoWeb.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Script.Serialization;
using Umbraco.Web.Mvc;
using System.IO.Compression;
using Umbraco.Web.WebApi;
using Umbraco.Core.Models;

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

        public async System.Threading.Tasks.Task<dynamic> GetDownloadImgAsync(string imgSrcListJson)
        {
            var comicList = new JavaScriptSerializer().Deserialize<List<Comic>>(imgSrcListJson);
            var fileName = Guid.NewGuid().ToString();
            ComicFolder comicFolder = new ComicFolder(comicList, fileName);

            var ms = Services.MediaService;
            var mediaMap = ms.CreateMedia(comicFolder.Comics[0].Title, 1070, "Folder");
            ms.Save(mediaMap);
            using (WebClient wc = new WebClient())
            {
                wc.Headers.Add("User-Agent", CONSTVALUE.USER_AGENT);
                wc.Headers.Add("Content-Type", CONSTVALUE.IMG_CONTENT_TYPE);
                try
                {
                    foreach (Comic comic in comicFolder.Comics)
                    {
                        try
                        {
                            var tempImg = await wc.OpenReadTaskAsync(comic.Url);

                            using (var memStream = new MemoryStream())
                            {
                                tempImg.CopyTo(memStream);
                                tempImg.Dispose();
                                var mediaImage = ms.CreateMedia(comic.Page, mediaMap, "Image");
                                mediaImage.SetValue("umbracoFile", comic.Page + ".jpg", memStream);
                                ms.Save(mediaImage);
                            }
                        }
                        catch (WebException wEx)
                        {
                            HttpWebResponse webResponse = (HttpWebResponse)wEx.Response;
                            if (webResponse.StatusCode == HttpStatusCode.NotFound)
                            {
                                continue;
                            }
                            else
                            {
                                return wEx;
                            }
                        }
                        
                    }
                    return mediaMap.Id;
                }
                catch (Exception ex)
                {
                    //throw ex;
                    return ex;
                }
            }
        }

        private bool IsDownloadCompleted(ComicFolder comicFolder, string dirPath)
        {
            return comicFolder.Comics.Count == Directory.GetFiles(dirPath).Count();
        }
    }
}
