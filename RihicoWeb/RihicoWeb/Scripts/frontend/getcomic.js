﻿var app = angular.module('getComic', ['ngResource']);
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
                //console.log('JSON.stringify($scope.model.comicDownloadList)', JSON.stringify($scope.model.comicDownloadList));
                //console.log('Passed Json File', angular.toJson($scope.model.comicDownloadList));
                getComicResource.downloadImg(angular.toJson($scope.model.comicDownloadList)).then(function (res) {
                    console.log('res', res);
                });
            } else {
                //Display loading icon maybe spin??
            }
        }, 500);
    }

    $scope.test = function () {
        var param = "[{\"Page\":\"1\",\"Url\":\"http://s2.nb-pintai.com/2017/03/14891008568710.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"6\",\"Url\":\"http://s2.nb-pintai.com/2017/03/14891008568745.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"2\",\"Url\":\"http://s2.nb-pintai.com/2017/03/14891008568731.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"5\",\"Url\":\"http://s2.nb-pintai.com/2017/03/14891008568744.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"4\",\"Url\":\"http://s2.nb-pintai.com/2017/03/14891008568733.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"3\",\"Url\":\"http://s2.nb-pintai.com/2017/03/14891008568732.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"7\",\"Url\":\"http://s2.nb-pintai.com/2017/03/14891008568746.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"8\",\"Url\":\"http://s2.nb-pintai.com/2017/03/14891008568747.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"9\",\"Url\":\"http://s2.nb-pintai.com/2017/03/14891008568758.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"10\",\"Url\":\"http://s2.nb-pintai.com/2017/03/14891008568759.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"11\",\"Url\":\"http://s2.nb-pintai.com/2017/03/148910085687510.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"13\",\"Url\":\"http://s2.nb-pintai.com/2017/03/148910085687612.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"12\",\"Url\":\"http://s2.nb-pintai.com/2017/03/148910085687511.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"9999\",\"Url\":\"http://s2.nb-pintai.com/2017/03/148910085687717.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"14\",\"Url\":\"http://s2.nb-pintai.com/2017/03/148910085687613.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"15\",\"Url\":\"http://s2.nb-pintai.com/2017/03/148910085687614.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"16\",\"Url\":\"http://s2.nb-pintai.com/2017/03/148910085687615.jpg\",\"Title\":\"海贼王858话\"},{\"Page\":\"17\",\"Url\":\"http://s2.nb-pintai.com/2017/03/148910085687616.jpg\",\"Title\":\"海贼王858话\"}]";
        var params = angular.toJson([{ "Page": "1", "Url": "http://s2.nb-pintai.com/2017/03/14891008568710.jpg", "Title": "海贼王858话" }, { "Page": "6", "Url": "http://s2.nb-pintai.com/2017/03/14891008568745.jpg", "Title": "海贼王858话" }, { "Page": "2", "Url": "http://s2.nb-pintai.com/2017/03/14891008568731.jpg", "Title": "海贼王858话" }, { "Page": "5", "Url": "http://s2.nb-pintai.com/2017/03/14891008568744.jpg", "Title": "海贼王858话" }, { "Page": "4", "Url": "http://s2.nb-pintai.com/2017/03/14891008568733.jpg", "Title": "海贼王858话" }, { "Page": "3", "Url": "http://s2.nb-pintai.com/2017/03/14891008568732.jpg", "Title": "海贼王858话" }, { "Page": "7", "Url": "http://s2.nb-pintai.com/2017/03/14891008568746.jpg", "Title": "海贼王858话" }, { "Page": "8", "Url": "http://s2.nb-pintai.com/2017/03/14891008568747.jpg", "Title": "海贼王858话" }, { "Page": "9", "Url": "http://s2.nb-pintai.com/2017/03/14891008568758.jpg", "Title": "海贼王858话" }, { "Page": "10", "Url": "http://s2.nb-pintai.com/2017/03/14891008568759.jpg", "Title": "海贼王858话" }, { "Page": "11", "Url": "http://s2.nb-pintai.com/2017/03/148910085687510.jpg", "Title": "海贼王858话" }, { "Page": "13", "Url": "http://s2.nb-pintai.com/2017/03/148910085687612.jpg", "Title": "海贼王858话" }, { "Page": "12", "Url": "http://s2.nb-pintai.com/2017/03/148910085687511.jpg", "Title": "海贼王858话" }, { "Page": "9999", "Url": "http://s2.nb-pintai.com/2017/03/148910085687717.jpg", "Title": "海贼王858话" }, { "Page": "14", "Url": "http://s2.nb-pintai.com/2017/03/148910085687613.jpg", "Title": "海贼王858话" }, { "Page": "15", "Url": "http://s2.nb-pintai.com/2017/03/148910085687614.jpg", "Title": "海贼王858话" }, { "Page": "16", "Url": "http://s2.nb-pintai.com/2017/03/148910085687615.jpg", "Title": "海贼王858话" }, { "Page": "17", "Url": "http://s2.nb-pintai.com/2017/03/148910085687616.jpg", "Title": "海贼王858话" }]);
        var paramss = angular.toJson([{ "Page": "1", "Url": "http://s2.nb-pintai.com/2017/03/14896517864090.jpg", "Title": "海贼王859话" }, { "Page": "2", "Url": "http://s2.nb-pintai.com/2017/03/14896517864111.jpg", "Title": "海贼王859话" }, { "Page": "4", "Url": "http://s2.nb-pintai.com/2017/03/14896517864123.jpg", "Title": "海贼王859话" }, { "Page": "3", "Url": "http://s2.nb-pintai.com/2017/03/14896517864122.jpg", "Title": "海贼王859话" }, { "Page": "7", "Url": "http://s2.nb-pintai.com/2017/03/14896517864146.jpg", "Title": "海贼王859话" }, { "Page": "5", "Url": "http://s2.nb-pintai.com/2017/03/14896517864124.jpg", "Title": "海贼王859话" }, { "Page": "6", "Url": "http://s2.nb-pintai.com/2017/03/14896517864135.jpg", "Title": "海贼王859话" }, { "Page": "8", "Url": "http://s2.nb-pintai.com/2017/03/14896517864147.jpg", "Title": "海贼王859话" }, { "Page": "9", "Url": "http://s2.nb-pintai.com/2017/03/14896517864158.jpg", "Title": "海贼王859话" }, { "Page": "10", "Url": "http://s2.nb-pintai.com/2017/03/14896517864159.jpg", "Title": "海贼王859话" }, { "Page": "11", "Url": "http://s2.nb-pintai.com/2017/03/148965178641510.jpg", "Title": "海贼王859话" }, { "Page": "13", "Url": "http://s2.nb-pintai.com/2017/03/148965178641612.jpg", "Title": "海贼王859话" }, { "Page": "12", "Url": "http://s2.nb-pintai.com/2017/03/148965178641511.jpg", "Title": "海贼王859话" }, { "Page": "14", "Url": "http://s2.nb-pintai.com/2017/03/148965178641613.jpg", "Title": "海贼王859话" }, { "Page": "15", "Url": "http://s2.nb-pintai.com/2017/03/148965178641714.jpg", "Title": "海贼王859话" }, { "Page": "9999", "Url": "http://s2.nb-pintai.com/2017/03/148965178641716.jpg", "Title": "海贼王859话" }, { "Page": "16", "Url": "http://s2.nb-pintai.com/2017/03/148965178641715.jpg", "Title": "海贼王859话" }]);
        getComicResource.downloadImg(paramss).then(function (res) {
            console.log('res', res);
        });
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
            return $http.get('/Umbraco/webAPI/ComicAPI/GetDownloadImgAsync',
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