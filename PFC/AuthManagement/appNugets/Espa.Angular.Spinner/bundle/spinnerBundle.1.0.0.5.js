///#source 1 1 /appNugets/Espa.Angular.Spinner/module.js
angular.module('espa.spinner', ['espa.httpInterceptor']);
//.run(['notificationChannel', function (notificationChannel) {
//    notificationChannel.
//}])
///#source 1 1 /appNugets/Espa.Angular.Spinner/directives/espaSpinner.js
'use strict';

angular.module('espa.spinner')
.directive('espaSpinner', ['notificationChannel', 'notificationChannelSpinner', '$rootScope','$timeout', '$http',
    function (notificationChannel, notificationChannelSpinner, $rootScope, $timeout, $http) {
    return {
        restrict: "AE",
        templateUrl: 'appNugets/Espa.Angular.Spinner/templates/spinnerTemplate.html?=v1',
        link: function (scope, element) {
            //hide the element initially taking into account the pending requests.
            if ($http.pendingRequests.length < 1 ) {
                element.hide();
            }

            var startRequestHandler = function (request) {
                //console.log('startRequestHandler');
                //check headers in order to know if we must show the spinner.
                if (request.ignoreSpinner == undefined || !request.ignoreSpinner)
                {
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

            

            notificationChannel.onRequestStarted(scope, startRequestHandler);

            notificationChannel.onRequestEnded(scope, endRequestHandler);

            
        }
    };
}]);
///#source 1 1 /appNugets/Espa.Angular.Spinner/Services/notificationChannelSpinner.js
'use strict';

angular.module('espa.spinner')
//Service Constants
.constant('notificationChannelSpinnerConstants', {
    events: {
        _START_REPEAT_: '_START_REPEAT_',
        _END_REPEAT_: '_END_REPEAT_'

    }
})
.service('notificationChannelSpinner', notificationChannelSpinnerService);

notificationChannelSpinnerService.$inject = ['notificationChannelSpinnerConstants', '$rootScope'];

function notificationChannelSpinnerService(notificationChannelConstants, $rootScope) {

        //broadcast event
        var repeatStarted = function (repeatID) {
            $rootScope.$broadcast(notificationChannelConstants.events._START_REPEAT_, repeatID);
        };

        //broadcast event
        var repeatEnded = function (repeatID) {
            $rootScope.$broadcast(notificationChannelConstants.events._END_REPEAT_, repeatID);
        };

        //map event to your handler
        var onRepeatEnded = function ($scope, handler) {
            $scope.$on(notificationChannelConstants.events._END_REPEAT_, function (event, repeatID) {
                handler(repeatID);
            });
        };

        //map event to your handler
        var onRepeatStarted = function ($scope, handler) {
            $scope.$on(notificationChannelConstants.events._START_REPEAT_, function (event, repeatID) {
                handler(repeatID);
            });
        };

        return {
            repeatEnded: repeatEnded,
            onRepeatEnded: onRepeatEnded,
            repeatStarted: repeatStarted,
            onRepeatStarted: onRepeatStarted
        };
};
