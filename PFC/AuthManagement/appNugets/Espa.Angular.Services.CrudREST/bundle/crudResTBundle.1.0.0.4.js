///#source 1 1 /appNugets/Espa.Angular.Services.CrudREST/module.js
angular.module('espa.crudRest', []);
///#source 1 1 /appNugets/Espa.Angular.Services.CrudREST/services/espaCrudRESTService.js
'use strict';

angular.module('espa.crudRest')
.service('espaCrudRESTService', ['$http', '$q', function ($http, $q) {

        var headers = {};

        //#region Private methods

        //GET service
        var restGet = function (getURL, isCache, customHeaders) {

            var httpHeaders = {};

            httpHeaders.method = 'GET';
            httpHeaders.cache = isCache;
            httpHeaders.url = getURL;
            httpHeaders.headers = {};

            if (customHeaders) {
                for (var i = 0; i < customHeaders.length; i++) {
                    httpHeaders.headers[customHeaders[i].key] = customHeaders[i].value;
                }
            }

            var deferred = $q.defer(); 

            $http(httpHeaders).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        //POST service
        var restPost = function (dataObject, postURL, isCache, customHeaders) {

            var httpHeaders = {};

            httpHeaders.method = 'POST';
            httpHeaders.cache = isCache;
            httpHeaders.url = postURL;
            httpHeaders.data = dataObject;
            httpHeaders.headers = {};

            if (customHeaders) {
                for (var i = 0; i < customHeaders.length; i++) {
                    httpHeaders.headers[customHeaders[i].key] = customHeaders[i].value;
                }
            }

            var deferred = $q.defer();

            $http(httpHeaders).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        //PUT service
        var restPut = function (putObject, putURL, isCache, customHeaders) {

            var httpHeaders = {};

            httpHeaders.method = 'PUT';
            httpHeaders.cache = isCache;
            httpHeaders.url = putURL;
            httpHeaders.data = putObject;
            httpHeaders.headers = {};

            if (customHeaders) {
                for (var i = 0; i < customHeaders.length; i++) {
                    httpHeaders.headers[customHeaders[i].key] = customHeaders[i].value;
                }
            }

            var deferred = $q.defer();

            $http(httpHeaders).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        //deleteNumberOfUnit DELETE service
        var restDelete = function (deleteURL, isCache, customHeaders) {

            var httpHeaders = {};

            httpHeaders.method = 'DELETE';
            httpHeaders.cache = isCache;
            httpHeaders.url = deleteURL;
            httpHeaders.headers = {};

            if (customHeaders) {
                for (var i = 0; i < customHeaders.length; i++) {
                    httpHeaders.headers[customHeaders[i].key] = customHeaders[i].value;
                }
            }

            var deferred = $q.defer();

            $http(httpHeaders).success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        };

        //#endregion Private methods

        return {
            restGet: restGet,
            restPost: restPost,
            restPut: restPut,
            restDelete: restDelete
        };

    }]);
