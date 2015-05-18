'use strict';

// Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
//'mgcrea.ngStrap'
angular.module('app', ['ngRoute', 'ngLocale',
                       'espa.crudRest', 'espa.publicOAuth', 'espa.spinner', 'espa.modal', 'espa.grid', 'espa.validations',
                       'espa.intranet', 'espa.errorHandling', 'espa.webapi'])
    .run(['$rootScope', function ($rootScope) {
        $rootScope.title = "";

        $rootScope.$on('$routeChangeError', function (event, current, previous, error) {
            if (error.status === 404) {
                $location.path('/home');
            }
        });
    }])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        $httpProvider.interceptors.push('httpInterceptorService');

        $routeProvider.
            when('/role', {
                templateUrl: './app/views/role.html',
                controller: 'roleCtrl',
                menuTitle: 'Roles',
                levelTree: [{ title: "Security", icon: "fa fa-lock" }, { title: "Auth Management", icon: "" }, { title: "Roles", icon: "" }]
            }).
            when('/client', {
                templateUrl: './app/views/client.html',
                controller: 'clientCtrl',
                menuTitle: 'Clients',
                levelTree: [{ title: "Security", icon: "fa fa-lock" }, { title: "Auth Management", icon: "" }, { title: "Clients", icon: "" }]
            }).
            when('/refreshToken', {
                templateUrl: './app/views/refreshtoken.html',
                controller: 'refreshTokenCtrl',
                menuTitle: 'RefreshTokens',
                levelTree: [{ title: "Security", icon: "fa fa-lock" }, { title: "Auth Management", icon: "" }, { title: "RefreshTokens", icon: "" }]
            }).
            when('/user', {
                templateUrl: './app/views/user.html',
                controller: 'userCtrl',
                menuTitle: 'Users',
                levelTree: [{ title: "Security", icon: "fa fa-lock" }, { title: "Auth Management", icon: "" }, { title: "Users", icon: "" }]
            })
        //    otherwise({ redirectTo: '/role' });

        //$locationProvider.html5Mode(true);
    }]);

