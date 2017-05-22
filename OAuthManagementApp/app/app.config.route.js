(function () {
    'use strict';

    angular.module('app')
        .config(configureRoute);

    configureRoute.$inject = ['$routeProvider'];

    function configureRoute($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: './app/views/login.html',
                controller: 'LoginController'
            })
            .when('/role', {
                templateUrl: './app/views/role.html',
                controller: 'RoleController'
            })
            .when('/client', {
                templateUrl: './app/views/client.html',
                controller: 'ClientController',
                controllerAs: 'vm'
            })
            .when('/refreshToken', {
                templateUrl: './app/views/refreshtoken.html',
                controller: 'RefreshTokenController'
            })
            .when('/user', {
                templateUrl: './app/views/user.html',
                controller: 'UserController'
            })
            .when('/home', {
                templateUrl: './app/views/home.html'
            })
            .otherwise({ redirectTo: '/home' });
    }
})();