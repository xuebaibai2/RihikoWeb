var app = angular.module('getComic', ['ngResource']);
app.controller('getComicController', function ($scope, getComicResource) {
    $scope.model = {};
    $scope.model.url = 'http://manhua.fzdm.com/';
    $scope.model.comicList = [];
    $scope.model.comicChapterList = [];
    $scope.model.comicDownloadList = [];
    $scope.model.lastPageNumber = 1000;
    $scope.comics = getComicResource.getComics.query();
    $scope.htmlParser = new DOMParser();
    
    var comicObj = function (label, url) {
        this.label = label;
        this.url = url;
    }

    var comicImgObj = function (page, url, title) {
        this.Page = page;
        this.Url = url;
        this.Title = title;
    }

    $scope.getComic = function () {
        getComicResource.getUrlContent($scope.model.url).then(function (res) {
            if (res.data.Message) {
                console.error(res.data.Message);
            }
            $scope.model.mainUrlContentAsString = res.data;
            $scope.model.mainUrlContentDom = $scope.htmlParser.parseFromString($scope.model.mainUrlContentAsString, "text/html");
            var comicList = $($scope.model.mainUrlContentDom).find('div#mhmain ul div.round li:nth-of-type(2) a');
            comicList.map(function (index, value) {
                $scope.model.comicList.push(new comicObj($(value).attr('title'), $scope.model.url + $(value).attr("href")));
            });
            initModal();
        });
    };

    $scope.getComicDetail = function (label, url) {
        $scope.model.comicChapterList = [];
        getComicResource.getUrlContent(url).then(function (res) {
            if (res.data.Message) {
                console.error(res.data.Message);
            }
            $scope.model.comicDetailContentAsString = res.data;
            $scope.model.comicDetailContentDom = $scope.htmlParser.parseFromString($scope.model.comicDetailContentAsString, "text/html");
            var comicChapterList = $($scope.model.comicDetailContentDom).find('div#content li a');
            comicChapterList.map(function (index, value) {
                $scope.model.comicChapterList.push(new comicObj($(value).attr('title'), url + $(value).attr("href")));
            });
            $('#comicDetailModal').modal({
                fadeDuration: 100,
                showClose: false,
            });
        });
    }

    $scope.downloadComic = function (label, url) {
        $scope.checkComicLastPage(url, url);
        var checkDownloadComplete = setInterval(function () {
            if ((parseInt($scope.model.lastPageNumber) + 1) == $scope.model.comicDownloadList.length) {
                clearInterval(checkDownloadComplete);
                console.log('JSON.stringify($scope.model.comicDownloadList)', JSON.stringify($scope.model.comicDownloadList));
                getComicResource.downloadImg(angular.toJson($scope.model.comicDownloadList));
            } else {
                //Display loading icon maybe spin??
            }
        }, 500);
    }

    $scope.checkComicLastPage = function (url, rootUrl) {
        getComicResource.getUrlContent(url).then(function (res) {
            if (res.data.Message) {
                console.error(res.data.Message);
            }
            var currentPageContentDom = $scope.htmlParser.parseFromString(res.data, "text/html");
            var currentPageImg = $(currentPageContentDom).find('div#mh img#mhpic');
            var currentPageNavs = $(currentPageContentDom).find('div#mh div.navigation a');
            currentPageNavs.map(function (index, value) {
                if (currentPageNavs.length == index + 1) {
                    if ($(value).html() == '下一页') {
                        $scope.checkComicLastPage(rootUrl + $(currentPageNavs[index - 1]).attr("href"), rootUrl);
                    } else {
                        if ($(value).html() == '下一话吧') {
                            $scope.model.lastPageUrl = $(currentPageNavs[index - 1]).attr("href");
                        } else {
                            $scope.model.lastPageUrl = $(value).attr("href");
                        }
                        $scope.model.lastPageNumber = $scope.getLastPageNumber($scope.model.lastPageUrl);
                        $scope.getImageUrlAsList(rootUrl)
                    }
                }
            });
        });
    }

    $scope.getLastPageNumber = function (lastPageUrl) {
        var pageNumberRegex = /index_(\d*)\.html/g;
        var match = pageNumberRegex.exec(lastPageUrl);
        return lastPageUrl != undefined ? match[1] : "9999";
    }

    $scope.getImageUrlAsList = function (rootUrl) {
        for (var i = 0; i <= $scope.model.lastPageNumber; i++) {
            var pageUrl = rootUrl + 'index_' + i + '.html';
            getComicResource.getUrlContent(pageUrl).then(function (res) {
                if (res.data.Message) {
                    console.error(res.data.Message);
                }
                var pageDom = $scope.htmlParser.parseFromString(res.data, "text/html");
                var comicImg = $(pageDom).find('img#mhpic');
                var pageNumAnchor = $(pageDom).find('div#mh li a');
                var chapterTitle = $(pageDom).find('div#mh h1');
                var pageNum = $scope.getLastPageNumber($(pageNumAnchor).attr('href'));
                $scope.model.comicDownloadList.push(new comicImgObj(pageNum, $(comicImg).attr('src'), $(chapterTitle).html()));
            });
        }
    }

    function initModal() {
        $('button.comicDetailModal').click(function (event) {
            event.preventDefault();
            $.get(this.href, function (html) {
                $(html).appendTo('body').modal();
            });
        });
    }

});
app.factory("getComicResource", function ($resource, $http) {
    return {
        getComics: $resource('/Umbraco/webAPI/ComicAPI/GetAllComic'),
        getUrlContent: function (url) {
            return $http.get('/Umbraco/webAPI/ComicAPI/GetUrlContent/',
                {
                    params: { url: url }
                });
        },
        downloadImg: function (imgSrcListJson) {
            $http.get('/Umbraco/webAPI/ComicAPI/GetDownloadImgAsync',
                {
                    params: { imgSrcListJson: imgSrcListJson}
                });
        }
    }
})
//return {
//    states: $resource('../data/states.json', {}, {
//        query: { method: 'GET', params: {}, isArray: false }
//    }),
//    countries: $resource('../data/countries.json', {}, {
//        query: { method: 'GET', params: {}, isArray: false }
//    })
//};