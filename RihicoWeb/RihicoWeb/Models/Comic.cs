using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RihicoWeb.Models
{
    public class Comic
    {
        public string Page { get; set; }
        public string Url { get; set; }
        public string Title { get; set; }
    }
    public class ComicFolder
    {
        public ComicFolder(List<Comic> Comics, string TempFolderName)
        {
            this.Comics = Comics;
            this.TempFolderName = TempFolderName;
        }
        public List<Comic> Comics { get; set; }
        public string TempFolderName { get; set; }
    }
}