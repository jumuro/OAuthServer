(function () {
    'use strict';

    // Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
    //'mgcrea.ngStrap'
    angular.module('app')
        .controller('appController', appController);

    AppController.$inject = ['$scope', 'webapiConstants'];

    function appController($scope, webapiConstants) {

    }
})();