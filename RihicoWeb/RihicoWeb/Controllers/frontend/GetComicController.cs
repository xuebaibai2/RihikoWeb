using RihicoWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Umbraco.Core.Models;
using Umbraco.Web;
using Umbraco.Web.Models;
using Umbraco.Web.Mvc;

namespace RihicoWeb.Controllers.frontend
{
    public class ComicController : RenderMvcController
    {
        public ActionResult Index(IPublishedContent content)
        {
            ComicViewModel model = new ComicViewModel(content);
            return View(model);
        }
    }
}