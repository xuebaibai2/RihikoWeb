angular.module("umbraco.resources").factory("ComicSyncToolResource", function ($q, $http, umbRequestHelper) {

    return {
        init: function () {
            return umbRequestHelper.resourcePromise(
                $http.get(umbRequestHelper.getApiUrl("comicSyncTool", "Init")),
                "Failed to init view");
        },
        syncToDropbox: function (chapter) {
            return umbRequestHelper.resourcePromise(
                $http.get(umbRequestHelper.getApiUrl("comicSyncTool", "SyncToDropbox", { chapter: chapter})),
                "Failed to sync");
        }
    };
});