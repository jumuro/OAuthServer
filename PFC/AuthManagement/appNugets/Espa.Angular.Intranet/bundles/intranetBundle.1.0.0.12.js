///#source 1 1 /appNugets/Espa.Angular.Intranet/module.js
'use strict';

angular.module('espa.intranet', ['toaster', 'espa.integratedSecurity', 'angular.filter'])
.config(['$routeProvider', function ($routeProvider) {
    
    $routeProvider.
        when('/404', {
            templateUrl: 'appNugets/Espa.Angular.Intranet/views/404.html',
            anonymous: true
        }).
        when('/dashboard', {
            templateUrl: 'appNugets/Espa.Angular.Intranet/views/dashboard.html',
            anonymous: true,
            levelTree: [{ title: 'Welcome', icon: '' }]
        }).
        otherwise({ redirectTo: '/dashboard' });

}]);
///#source 1 1 /appNugets/Espa.Angular.Intranet/services/notificationChannelIntranet.js
'use strict';

angular.module('espa.intranet')
//Service Constants
.constant('notificationChannelIntranetConstants', {
    events: {
        _END_AUTHENTICATION_: '_END_AUTHENTICATION_'

    }
})
.service('notificationChannelIntranet', ['notificationChannelIntranetConstants', '$rootScope',
    function (notificationChannelConstants, $rootScope) {

        //broadcast event
        var authEnded = function () {
            $rootScope.$broadcast(notificationChannelConstants.events._END_AUTHENTICATION_);
        };

        //map event to your handler
        var onAuthEnded = function ($scope, handler) {
            $scope.$on(notificationChannelConstants.events._END_AUTHENTICATION_, function (event) {
                handler();
            });
        };

        return {
            authEnded: authEnded,
            onAuthEnded: onAuthEnded
        };
    }]);
///#source 1 1 /appNugets/Espa.Angular.Intranet/directives/intranetNavMenuDirective.js

'use strict';

angular.module('espa.intranet')

.directive('espaMenu', espaMenuDirective);

function espaMenuDirective() {

    return {
        restrict: "AE",
        templateUrl: "appNugets/Espa.Angular.Intranet/templates/espaMenuTemplate.html?v=1",
        controller: espaMenuDirectiveController
    }

    espaMenuDirectiveController.$inject = ['$scope', '$element', 'authService', 'securityConstants',
                    'notificationChannelIntranet', '$route', '$rootScope', '$sce', '$window', '$timeout', '$document'];

    function espaMenuDirectiveController($scope, $element, authService, securityConstants,
                                notificationChannel, $route, $rootScope, $sce, $window, $timeout, $document) {


        $scope.isNoFlyOut = function (item) {
            return !(item.childs && item.childs.length > 0);
        }

        var paintMenu = function () {

            var webFactory = authService.getlocalStorage();

            if (webFactory != undefined) {
                $scope.fullName = webFactory.userProfile.fullName;
                $scope.roles = webFactory.userSecurity.roles;
                $scope.levelList = webFactory.userMenu;
                $scope.environment = webFactory.environment;
            }

        };

        $scope.initialize = function () {
            paintMenu();
            $scope.showLevel1 = false;
        };

        $scope.selectPage = function (menu) {
            
            $scope.collapseMenu = true;

            ClearMenuFromLevel(0);
        };

        var ClearMenuFromLevel = function (level) {
            if (level == 0) {
                for (var i = 0; i < $scope.levelList.length; i++) {
                    for (var j = 0; j < $scope.levelList[i].childs.length; j++) {
                        $scope.levelList[i].childs[j].showSubLevel = false;
                    }


                    $scope.levelList[i].showSubLevel = false;
                }
            }
            else {
                for (var i = 0; i < $scope.levelList.length; i++) {
                    for (var j = 0; j < $scope.levelList[i].childs.length; j++) {
                        $scope.levelList[i].childs[j].showSubLevel = false;
                    }
                }
            }
        }

        $scope.showSubLevel = function (level) {
            ClearMenuFromLevel(level.level);
            level.showSubLevel = true;
        };

        $document.on('click', function (event) {
            var clickedOnMenu = $element.find(event.target).length > 0 || !$(event.target).is(":visible");
            if (clickedOnMenu) {
                return;
            }
            else {
                $rootScope.$evalAsync(function () {
                    ClearMenuFromLevel(0);
                });
            }

        });

        $scope.resetAuthService = function () {
            //Reset auth service in order to get a posible new security info
            authService.reset();
        };



        //Wait for the end of authentication process.
        var endAuthHandler = function () {
            paintMenu();
        };

        notificationChannel.onAuthEnded($scope, endAuthHandler);
    }
}
