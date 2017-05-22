///#source 1 1 /appNugets/Jumuro.Angular.CrudREST/module.js
(function () {
    'use strict';

    angular.module('jumuro.crudRest', []);
})();
///#source 1 1 /appNugets/Jumuro.Angular.CrudREST/services/jumuroCrudRESTService.js
(function () {
    'use strict';

    angular.module('jumuro.crudRest')
        .factory('jumuroCrudRESTService', jumuroCrudRESTService);

    jumuroCrudRESTService.$inject = ['$http', '$q'];

    function jumuroCrudRESTService($http, $q) {
        var headers = {};
        var service = {
            restGet: restGet,
            restPost: restPost,
            restPut: restPut,
            restDelete: restDelete
        };
        
        return service;

        function restGet(getURL, isCache, customHeaders) {
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
        }

        function restPost(dataObject, postURL, isCache, customHeaders) {
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
        }

        function restPut(putObject, putURL, isCache, customHeaders) {
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
        }

        function restDelete(deleteURL, isCache, customHeaders) {
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
        }
    }
})();
