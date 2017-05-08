using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RihicoWeb.Application
{
    public struct CONSTVALUE
    {
        public const string USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393";

        public const string HTML_CONTENT_TYPE = "text/plain;charset=UTF-8";

        public const string IMG_CONTENT_TYPE = "image/jpeg";

        public const string DROPBOX_SAVE_URL = "https://api.dropboxapi.com/1/save_url/auto/1";

        public const string DROPBOX_WC_HEADER_CONTENTTYPE = "application/x-www-form-urlencoded";

        public const string DROPBOX_WC_HEADER_AUTHORIZATION = "Bearer {0}";
    }
}