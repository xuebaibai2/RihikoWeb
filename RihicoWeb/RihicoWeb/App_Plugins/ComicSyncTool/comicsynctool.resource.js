angular.module("umbraco.resources").factory("ComicSyncToolResource", function ($q, $http, umbRequestHelper) {

    return {
        init: function () {
            return umbRequestHelper.resourcePromise(
                $http.get(umbRequestHelper.getApiUrl("comicSyncTool", "Init")),
                "Failed to init view");
        }
        //getModelsOutOfDateStatus: function () {
        //    return umbRequestHelper.resourcePromise(
        //        $http.get(umbRequestHelper.getApiUrl("modelsBuilderBaseUrl", "GetModelsOutOfDateStatus")),
        //        "Failed to get models out-of-date status");
        //},

        //buildModels: function () {
        //    return umbRequestHelper.resourcePromise(
        //        $http.post(umbRequestHelper.getApiUrl("modelsBuilderBaseUrl", "BuildModels")),
        //        "Failed to build models");
        //},

        //getDashboard: function () {
        //    return umbRequestHelper.resourcePromise(
        //        $http.get(umbRequestHelper.getApiUrl("modelsBuilderBaseUrl", "GetDashboard")),
        //        "Failed to get dashboard");
        //}
    };
});