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

        private void SubscribeServerVariable(object sender, Dictionary<string, object> serverVars)
        {
            if (!serverVars.ContainsKey("umbracoUrls"))
                throw new Exception("Missing umbracoUrls.");
            var umbracoUrlsObject = serverVars["umbracoUrls"];
            if (umbracoUrlsObject == null)
                throw new Exception("Null umbracoUrls");
            var umbracoUrls = umbracoUrlsObject as Dictionary<string, object>;
            if (umbracoUrls == null)
                throw new Exception("Invalid umbracoUrls");

            if (!serverVars.ContainsKey("umbracoPlugins"))
                throw new Exception("Missing umbracoPlugins.");
            var umbracoPlugins = serverVars["umbracoPlugins"] as Dictionary<string, object>;
            if (umbracoPlugins == null)
                throw new Exception("Invalid umbracoPlugins");

            if (HttpContext.Current == null) throw new InvalidOperationException("HttpContext is null");
            var urlHelper = new UrlHelper(new RequestContext(new HttpContextWrapper(HttpContext.Current), new RouteData()));

            umbracoUrls.Add("comicSyncTool", urlHelper.GetUmbracoApiServiceBaseUrl<ComicSyncToolController>(x => x.Init()));
        }
    }
}