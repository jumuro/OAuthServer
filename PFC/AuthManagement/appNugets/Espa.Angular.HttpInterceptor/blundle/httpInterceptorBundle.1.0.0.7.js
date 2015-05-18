///#source 1 1 /appNugets/Espa.Angular.HttpInterceptor/module.js
angular.module('espa.httpInterceptor', ['espa.notificationChannel', 'toaster']);
///#source 1 1 /appNugets/Espa.Angular.HttpInterceptor/services/notificationChannelRequestExt.js
'use strict';

angular.module('espa.httpInterceptor')
.service('notificationChannelRequestExt', ['notificationChannel', 'notificationChannelConstants', '$rootScope',
    function (notificationChannel, notificationChannelConstants, $rootScope) {
    
    notificationChannelConstants.events._START_REQUEST_ = '_START_REQUEST_';
    notificationChannelConstants.events._END_REQUEST_ = '_END_REQUEST_';

    var serviceExtention = angular.extend(notificationChannel, {});

    //broadcast event
    serviceExtention.requestStarted = function (request) {
        $rootScope.$broadcast(notificationChannelConstants.events._START_REQUEST_, request);
    };
    //broadcast event
    serviceExtention.requestEnded = function (response) {
        $rootScope.$broadcast(notificationChannelConstants.events._END_REQUEST_, response);
    };

    //map event to your handler
    serviceExtention.onRequestStarted = function ($scope, handler) {
        $scope.$on(notificationChannelConstants.events._START_REQUEST_, function (event, request) {
            handler(request);
        });
    };
    //map event to your handler
    serviceExtention.onRequestEnded = function ($scope, handler) {
        $scope.$on(notificationChannelConstants.events._END_REQUEST_, function (event, response) {
            handler(response);
        });
    };
}]);
///#source 1 1 /appNugets/Espa.Angular.HttpInterceptor/services/httpInterceptorService.js
'use strict';

angular.module('espa.httpInterceptor')
.service('httpInterceptorService', ['$q', '$injector', 'toaster', 'notificationChannelRequestExt',
    function ($q, $injector, toaster, notificationChannelRequestExt) {
    var notificationChannel, $http;

    return {
        // optional method
        'request': function (config) {
            // do something on success

            // get notificationChannel via $injector because of circular dependency problem
            notificationChannel = notificationChannel || $injector.get('notificationChannel');
            // send a notification requests are complete
            notificationChannel.requestStarted(config);

            return config;
        },

        // optional method
        'requestError': function (rejection) {
            // do something on error
            // get notificationChannel via $injector because of circular dependency problem
            notificationChannel = notificationChannel || $injector.get('notificationChannel');
            // send a notification requests are complete
            notificationChannel.requestEnded(rejection);

            return $q.reject(rejection);
        },



        // optional method
        'response': function (response) {
            // do something on success

            // get $http via $injector because of circular dependency problem
            $http = $http || $injector.get('$http');

            // don't send notification until all requests are complete
            if ($http.pendingRequests.length < 1) {
                // get notificationChannel via $injector because of circular dependency problem
                notificationChannel = notificationChannel || $injector.get('notificationChannel');
                // send a notification requests are complete
                notificationChannel.requestEnded(response);
            }

            if (response != undefined)
            {
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
        },

        // optional method
        'responseError': function (rejection) {
            // do something on error

            // get $http via $injector because of circular dependency problem
            $http = $http || $injector.get('$http');
            // don't send notification until all requests are complete
            if ($http.pendingRequests.length < 1) {

                // get notificationChannel via $injector because of circular dependency problem
                notificationChannel = notificationChannel || $injector.get('notificationChannel');

                // send a notification requests are complete
                notificationChannel.requestEnded(rejection);
            }

            if (rejection != undefined) {
                //display error
                if (rejection.status === 400) {
                    if (rejection.data[0]) {
                        //notificationChannel.dataAnnotationError({ errorModel: rejection.data });
                        toaster.pop('error', "Bad Request", rejection.data[0]);
                    }
                }
                //else if (rejection.status === 401 || rejection.satus === 403) {
                //    //$location.path('/dashboard');
                //    if (rejection.data) {
                //        toaster.pop('error', "Access Denied", "You are not authorized to do this request."); //+ rejection.data.exceptionMessage);
                //    }
                //}
                else if (rejection.status === 404) {
                    if (rejection.data) {
                        toaster.pop('error', "Not Found", rejection.data);
                    }
                }
                else if (rejection.status === 409) {
                    if (rejection.data) {
                        toaster.pop('error', "Conflict", rejection.data);
                    }
                }
                else if (rejection.status === 500) {
                    if (rejection.data) {
                        toaster.pop('error', "Internal Server", "Internal server error");
                    }
                }
                else if (rejection.status === 304) {
                    if (rejection.data) {
                        toaster.pop('warning', "Warning", "Not modified");
                    }
                }
                //else {
                //    toaster.pop('error', "Error", "Unexpected server error"); //+ rejection.data.exceptionMessage);
                //}
            }

            return $q.reject(rejection);
        }
    };
}]);
