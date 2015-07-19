(function () {
    'use strict';

    // Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
    //'mgcrea.ngStrap'
    angular.module('app', ['ngRoute', 'ngLocale',
                           'jumuro.crudRest', 'espa.publicOAuth', 'jumuro.spinner', 'jumuro.modal', 'jumuro.grid', 'espa.validations',
                           'espa.intranet', 'espa.errorHandling', 'jumuro.webapi']);
})();