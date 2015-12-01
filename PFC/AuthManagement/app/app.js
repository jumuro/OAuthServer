(function () {
    'use strict';

    // Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
    //'mgcrea.ngStrap'
    angular.module('app', ['ngRoute', 'ngLocale',
                           'jumuro.crudRest', 'jumuro.oAuth', 'jumuro.spinner', 'jumuro.modal', 'jumuro.grid', 'jumuro.validations', 'jumuro.webapi']);
})();