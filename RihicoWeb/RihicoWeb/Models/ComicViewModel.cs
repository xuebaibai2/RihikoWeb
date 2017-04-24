using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.Models;
using Umbraco.Web.Models;

namespace RihicoWeb.Models
{
    public class ComicViewModel : RihikoViewModel
    {
        public ComicViewModel(IPublishedContent content) : base(content)
        {
        }

        public string Url { get; set; }
    }
}