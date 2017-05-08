using System;
using RihicoWeb.Models.backend;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Script.Serialization;
using RihicoWeb.Application;
using Umbraco.Web.WebApi;

namespace RihicoWeb.Controllers.backend
{
    public class ComicSyncToolController : UmbracoAuthorizedApiController
    {
        //[AcceptVerbs("GET", "POST")]
        [HttpGet]
        public dynamic Init()
        {
            var comicFolderList = new List<MediaModel>();
            var result = Umbraco.Media(1070).Children;
            foreach (var folder in result)
            {
                var tempChildren = new List<MediaModel>();
                foreach (var child in folder.Children)
                {
                    tempChildren.Add(new MediaModel()
                    {
                        Id = child.Id,
                        Name = child.Name,
                        ItemType = child.ItemType,
                        DocumentTypeAlias = child.DocumentTypeAlias,
                        Level = child.Level,
                        Url = child.Url,
                        UrlName = child.UrlName
                    });
                }
                comicFolderList.Add(new MediaModel()
                {
                    Id = folder.Id,
                    Name = folder.Name,
                    ItemType = folder.ItemType,
                    DocumentTypeAlias = folder.DocumentTypeAlias,
                    Level = folder.Level,
                    Url = folder.Url,
                    UrlName = folder.UrlName,
                    Children = tempChildren
                });
            }
            return comicFolderList;
        }

        [HttpGet]
        public dynamic SyncToDropbox(string chapter)
        {
            var chapterObj = new JavaScriptSerializer().Deserialize<MediaModel>(chapter);

            var urlAuthority = "http://" + HttpContext.Current.Request.Url.Authority + "{0}";
            const string myParameters = "url={0}&path={1}";
            var sb = new StringBuilder();

            foreach (var page in chapterObj.Children)
            {
                using (var wc = new WebClient())
                {
                    try
                    {
                        wc.Headers[HttpRequestHeader.ContentType] = CONSTVALUE.DROPBOX_WC_HEADER_CONTENTTYPE;
                        wc.Headers[HttpRequestHeader.Authorization] = string.Format(CONSTVALUE.DROPBOX_WC_HEADER_AUTHORIZATION, ConfigurationManager.AppSettings["DropboxToken"]);
                        sb.Append(wc.UploadString(CONSTVALUE.DROPBOX_SAVE_URL, string.Format(myParameters, string.Format(urlAuthority, page.Url), chapterObj.Name + "/" + page.Name + ".jpg")));
                    }
                    catch (Exception e)
                    {
                        return new { SB = sb, ERROR = e.Message };
                    }
                }
            }
            return sb.ToString();
        }
    }
}