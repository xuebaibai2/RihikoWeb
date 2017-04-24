using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Core.Models;
using Umbraco.Web.Models;

namespace RihicoWeb.Models
{
    public class RihikoViewModel : RenderModel
    {
        public RihikoViewModel(IPublishedContent content) : base(content)
        {
        }
    }
}