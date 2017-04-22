using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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
    }
}
