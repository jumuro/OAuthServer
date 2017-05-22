///#source 1 1 /appNugets/Jumuro.Angular.Spinner/module.js
angular.module('jumuro.spinner', ['jumuro.httpInterceptor']);
///#source 1 1 /appNugets/Jumuro.Angular.Spinner/directives/jumuroSpinner.js
'use strict';

angular.module('jumuro.spinner')
.directive('jumuroSpinner', ['httpInterceptorNotificationChannelService', '$rootScope', '$timeout', '$http',
    function (httpInterceptorNotificationChannelService, $rootScope, $timeout, $http) {
        return {
            restrict: "AE",
            templateUrl: 'appNugets/Jumuro.Angular.Spinner/templates/spinnerTemplate.html?=v1',
            link: function (scope, element) {
                //hide the element initially taking into account the pending requests.
                if ($http.pendingRequests.length < 1) {
                    element.hide();
                }

                var startRequestHandler = function (request) {
                    //console.log('startRequestHandler');
                    //check headers in order to know if we must show the spinner.
                    if (request.ignoreSpinner == undefined || !request.ignoreSpinner) {
                        //console.log('Show spinner');
                        // got the request start notification, show the element
                        element.show();
                    }
                };

                var endRequestHandler = function () {
                    //console.log('endRequestHandler');
                    $rootScope.$evalAsync(function () {
                        //console.log('hide endRequestHandler');
                        // got the request end notification and hide the element taking into account the angular processing.
                        element.hide();
                    });

                };

                httpInterceptorNotificationChannelService.onRequestStarted(scope, startRequestHandler);

                httpInterceptorNotificationChannelService.onRequestEnded(scope, endRequestHandler);
            }
        };
    }]);
///#source 1 1 /appNugets/Jumuro.Angular.Spinner/services/spinnerNotificationChannelService.js
'use strict';

angular.module('jumuro.spinner')
//Service Constants
.constant('spinnerNotificationChannelConstants', {
    events: {
        _START_REPEAT_: '_START_REPEAT_',
        _END_REPEAT_: '_END_REPEAT_'

    }
})
.service('spinnerNotificationChannelService', spinnerNotificationChannelService);

spinnerNotificationChannelService.$inject = ['spinnerNotificationChannelConstants', '$rootScope'];

function spinnerNotificationChannelService(spinnerNotificationChannelConstants, $rootScope) {
    //broadcast event
    var repeatStarted = function (repeatID) {
        $rootScope.$broadcast(spinnerNotificationChannelConstants.events._START_REPEAT_, repeatID);
    };

    //broadcast event
    var repeatEnded = function (repeatID) {
        $rootScope.$broadcast(spinnerNotificationChannelConstants.events._END_REPEAT_, repeatID);
    };

    //map event to your handler
    var onRepeatStarted = function ($scope, handler) {
        $scope.$on(spinnerNotificationChannelConstants.events._START_REPEAT_, function (event, repeatID) {
            handler(repeatID);
        });
    };

    //map event to your handler
    var onRepeatEnded = function ($scope, handler) {
        $scope.$on(spinnerNotificationChannelConstants.events._END_REPEAT_, function (event, repeatID) {
            handler(repeatID);
        });
    };

    return {
        repeatStarted: repeatStarted,
        repeatEnded: repeatEnded,
        onRepeatStarted: onRepeatStarted,
        onRepeatEnded: onRepeatEnded
    };
};
