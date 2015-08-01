///#source 1 1 /appNugets/Jumuro.Angular.HttpInterceptor/module.js
(function () {
    angular.module('jumuro.httpInterceptor', ['toaster']);
})();
///#source 1 1 /appNugets/Jumuro.Angular.HttpInterceptor/services/httpInterceptorNotificationChannelConstants.js
(function () {
    'use strict';

    angular.module('jumuro.httpInterceptor')
        .constant('httpInterceptorNotificationChannelConstants', {
            events: {
                _START_REQUEST_: '_START_REQUEST_',
                _END_REQUEST_: '_END_REQUEST_'
            }
        });
})();
///#source 1 1 /appNugets/Jumuro.Angular.HttpInterceptor/services/httpInterceptorNotificationChannelService.js
(function () {
    'use strict';

    angular.module('jumuro.httpInterceptor')
        .factory('httpInterceptorNotificationChannelService', httpInterceptorNotificationChannelService);

    httpInterceptorNotificationChannelService.$inject = ['httpInterceptorNotificationChannelConstants', '$rootScope'];

    function httpInterceptorNotificationChannelService(httpInterceptorNotificationChannelConstants, $rootScope) {
        var service = {
            requestStarted: requestStarted,
            requestEnded: requestEnded,
            onRequestStarted: onRequestStarted,
            onRequestEnded: onRequestEnded
        }

        return service;
        ///////////////

        //broadcast event
        function requestStarted(request) {
            $rootScope.$broadcast(httpInterceptorNotificationChannelConstants.events._START_REQUEST_, request);
        }

        //broadcast event
        function requestEnded(response) {
            $rootScope.$broadcast(httpInterceptorNotificationChannelConstants.events._END_REQUEST_, response);
        }

        //map event to your handler
        function onRequestStarted($scope, handler) {
            $scope.$on(httpInterceptorNotificationChannelConstants.events._START_REQUEST_, function (event, request) {
                handler(request);
            });
        }

        //map event to your handler
        function onRequestEnded($scope, handler) {
            $scope.$on(httpInterceptorNotificationChannelConstants.events._END_REQUEST_, function (event, response) {
                handler(response);
            });
        }
    }
})();
///#source 1 1 /appNugets/Jumuro.Angular.HttpInterceptor/services/httpInterceptorService.js
(function () {
    'use strict';

    angular.module('jumuro.httpInterceptor')
        .factory('httpInterceptorService', httpInterceptorService);

    httpInterceptorService.$inject = ['$q', '$injector', 'toaster', 'httpInterceptorNotificationChannelService'];

    function httpInterceptorService($q, $injector, toaster, httpInterceptorNotificationChannelFactory) {
        var $http;
        var service = {
            request: request,
            requestError: requestError,
            response: response,
            responseError: responseError
        };

        return service;
        ///////////////

        // optional method
        function request(config) {
            // do something on success

            // send notification requests are complete
            httpInterceptorNotificationChannelFactory.requestStarted(config);

            return config;
        }

        // optional method
        function requestError(rejection) {
            // do something on error

            // send notification requests are complete
            httpInterceptorNotificationChannelFactory.requestEnded(rejection);

            return $q.reject(rejection);
        }

        // optional method
        function response(response) {
            // do something on success

            // get $http via $injector because of circular dependency problem
            $http = $http || $injector.get('$http');

            // don't send notification until all requests are complete
            if ($http.pendingRequests.length < 1) {
                // send notification requests are complete
                httpInterceptorNotificationChannelFactory.requestEnded(response);
            }

            if (response != undefined) {
                if (response.status === 201) {
                    var header = response.headers();
                    if (header.message != undefined) {
                        toaster.pop('sucess', "Success", header.message);
                    }
                }
                else if (response.status === 200) {
                    var header = response.headers();
                    if (header.message != undefined) {
                        toaster.pop('sucess', "Success", header.message);
                    }
                }
            }

            return response;
        }

        // optional method
        function responseError(rejection) {
            // get $http via $injector because of circular dependency problem
            $http = $http || $injector.get('$http');
            // don't send notification until all requests are complete
            if ($http.pendingRequests.length < 1) {
                // send notification requests are complete
                httpInterceptorNotificationChannelFactory.requestEnded(rejection);
            }

            return $q.reject(rejection);
        }
    }
})();