(function () {
    'use strict';

    angular.module('app')
        .config(configureRoute);

    configureRoute.$inject = ['$routeProvider'];

    function configureRoute($routeProvider) {
        $routeProvider.
            when('/role', {
                templateUrl: './app/views/role.html',
                controller: 'roleCtrl',
                menuTitle: 'Roles',
                levelTree: [{ title: "Security", icon: "fa fa-lock" }, { title: "Auth Management", icon: "" }, { title: "Roles", icon: "" }]
            }).
            when('/client', {
                templateUrl: './app/views/client.html',
                controller: 'ClientCtrl',
                controllerAs: 'vm',
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
            //otherwise({ redirectTo: '/role' });
    }
})();