var app = angular.module('getComic', ['ngResource']);
app.controller('getComicController', function ($scope, getComicResource) {
    $scope.model = {};
    $scope.users = getComicResource.getUser.query();
    $scope.comics = getComicResource.getComics.query();
    console.log(getComicResource.getAnotherComics.query());
    $scope.getComic = function () {

    };
});
app.factory("getComicResource", function ($resource) {
    return {
        getUser: $resource('https://jsonplaceholder.typicode.com/users/:user', { user: '@user' }, {
            update: {
                method: 'PUT'
            }
        }),
        getComics: $resource('/Umbraco/webAPI/ComicAPI/GetAllComic'),
        getAnotherComics: $resource('/api/NotUmbracoAPI/GetAllComic')
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