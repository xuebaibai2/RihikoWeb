using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.Models;

namespace RihicoWeb.Models.backend
{
    public class MediaModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Level { get; set; }
        public string DocumentTypeAlias { get; set; }
        public PublishedItemType ItemType { get; set; }
        public string Url { get; set; }
        public string UrlName { get; set; }
        public List<MediaModel> Children { get; set; }
    }
}