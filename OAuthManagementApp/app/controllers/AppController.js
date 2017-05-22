(function () {
    'use strict';

    // Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
    //'mgcrea.ngStrap'
    angular.module('app')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', 'webapiConstants'];

    function AppController($scope, webapiConstants) {

    }
})();