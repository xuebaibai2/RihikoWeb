var app = angular.module('getComic', ['ngResource']);
app.controller('getComicController', function ($scope, getComicResource) {
    $scope.model = {};
    $scope.model.url = 'http://manhua.fzdm.com/';
    $scope.model.comicList = [];
    $scope.model.comicChapterList = [];
    $scope.comics = getComicResource.getComics.query();
    $scope.htmlParser = new DOMParser();



    var comicObj = function (label, url) {
        this.label = label;
        this.url = url;
    }

    $scope.getComic = function () {
        getComicResource.getUrlContent($scope.model.url).then(function (res) {
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