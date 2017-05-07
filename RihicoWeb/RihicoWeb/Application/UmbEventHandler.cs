using RihicoWeb.Controllers.backend;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Umbraco.Core;
using Umbraco.Web;
using Umbraco.Web.Mvc;
using Umbraco.Web.UI.JavaScript;

namespace RihicoWeb.Application
{
    public class UmbEventHandler : ApplicationEventHandler
    {
        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            ServerVariablesParser.Parsing += SubscribeServerVariable;
        }

        private void SubscribeServerVariable(object sender, Dictionary<string, object> umbracoUrls)
        {
            if (HttpContext.Current == null) throw new InvalidOperationException("HttpContext is null");
            var urlHelper = new UrlHelper(new RequestContext(new HttpContextWrapper(HttpContext.Current), new RouteData()));

            (umbracoUrls["umbracoUrls"] as Dictionary<string, object>)["comicSyncTool"] = urlHelper.GetUmbracoApiServiceBaseUrl<ComicSyncToolController>(x => x.Init());
        }
    }
}