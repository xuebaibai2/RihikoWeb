using RihicoWeb.Models.backend;
using System.Collections.Generic;
using System.Web.Http;
using Umbraco.Web.WebApi;

namespace RihicoWeb.Controllers.backend
{
    public class ComicSyncToolController : UmbracoAuthorizedApiController
    {
        //[AcceptVerbs("GET", "POST")]
        [HttpGet]
        public dynamic Init()
        {
            var comic = Services.MediaService.GetById(1070);
            List<MediaModel> comicFolderList = new List<MediaModel>();
            var result = Umbraco.Media(1070).Children;
            foreach (var folder in result)
            {
                List<MediaModel> tempChildren = new List<MediaModel>();
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
    }
}