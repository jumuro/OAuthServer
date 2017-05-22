(function () {
    'use strict';

    angular.module('app')
        .config(configure);

    configure.$inject = ['$locationProvider', '$httpProvider'];

    function configure($locationProvider, $httpProvider) {
        $httpProvider.interceptors.push('httpInterceptorService');

        //$locationProvider.html5Mode(true);
    }
})();