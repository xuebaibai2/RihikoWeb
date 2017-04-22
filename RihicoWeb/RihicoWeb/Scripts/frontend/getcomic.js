var app = angular.module('getComic', ['ngResource']);
app.controller('getComicController', function ($scope, getComicResource) {
    $scope.model = {};
    $scope.model.url = 'http://manhua.fzdm.com/';
    $scope.model.comicList = [];
    $scope.model.comicChapterList = [];
    $scope.model.comicDownloadList = [];
    $scope.comics = getComicResource.getComics.query();
    $scope.htmlParser = new DOMParser();



    var comicObj = function (label, url) {
        this.label = label;
        this.url = url;
    }

    var comicImgObj = function (url) {
        this.url = url;
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
        //$scope.model.currentChapterRoot = url;
        console.log('url', url);
        $scope.checkComicLastPage(url, url);
        //TODO: use regex to get number from $scope.model.lastPageUrl which is the page number and loop again to retrieve all images from each page
    }

    $scope.checkComicLastPage = function (url, rootUrl) {
        getComicResource.getUrlContent(url).then(function (res) {
            var currentPageContentDom = $scope.htmlParser.parseFromString(res.data, "text/html");
            var currentPageImg = $(currentPageContentDom).find('div#mh img#mhpic');
            var currentPageNavs = $(currentPageContentDom).find('div#mh div.navigation a');
            currentPageNavs.map(function (index, value) {
                if (currentPageNavs.length == index + 1) {
                    if ($(value).html() == '下一页') {
                        $scope.checkComicLastPage(rootUrl + $(currentPageNavs[index-1]).attr("href"), rootUrl);
                        console.log(rootUrl + $(currentPageNavs[index-1]).attr("href"));
                        console.log('rootUrl', rootUrl);
                    } else {
                        if ($(value).html() == '下一话吧') {
                            $scope.model.lastPageUrl = $(currentPageNavs[index - 1]).attr("href");
                        } else {
                            $scope.model.lastPageUrl = $(value).attr("href");
                        }
                    }
                }
            });
        });
    }

    $scope.getLastPageNumber = function (url) {
        //TODO
    }

    $scope.getImageUrlAsList = function () {
        //TODO
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