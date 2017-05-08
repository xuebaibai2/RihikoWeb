angular.module('umbraco').controller('ComicSyncToolController', function ($scope, $routeParams, ComicSyncToolResource, assetsService) {
    $scope.ViewModel = {};
    $scope.IsInit = false;

    assetsService.loadCss("/Content/font-awesome.min.css", $scope, '', 10000);

    init();

    $scope.sync = function (chapter) {
        var chapterJson = JSON.stringify(chapter);
        ComicSyncToolResource.syncToDropbox(chapterJson).then(function(res) {
            console.log('res', res);
        });
    }

    function init() {
        ComicSyncToolResource.init().then(function (res) {
            console.log('res',res);
            $scope.ViewModel = res;
            $scope.IsInit = true;
        });
    }
});