angular.module('umbraco').controller('ComicSyncToolController', function ($scope, umbRequestHelper, $log, $http, ComicSyncToolResource) {
    $scope.ViewModel = {};

    init();

    function init() {
        ComicSyncToolResource.init().then(function (res) {
            console.log('res',res);
        });
    }
});