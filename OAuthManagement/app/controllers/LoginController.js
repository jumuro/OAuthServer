'use strict';

angular.module('app')
    .controller('LoginController', LoginController);

LoginController.$inject = ['$scope', 'oAuthService', '$location', '$rootScope'];

function LoginController($scope, oAuthService, $location, $rootScope) {
    $scope.logIn = function () {
        logInFunct();
    }

    $scope.loginKeyPress = function (keyEvent) {
        if (keyEvent.which === 13) {
            logInFunct();
        }
    }

    var logInFunct = function () {
        oAuthService.logIn($scope.login).then(function (data) {
            $rootScope.user = $scope.login.username.toUpperCase();
            $location.path('/');
            $rootScope.isLoginCollapsed = true;
        }, function () {

        });
    }
}
