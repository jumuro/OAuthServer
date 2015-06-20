(function () {
    'use strict';

    // Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
    //'mgcrea.ngStrap'
    angular.module('app', ['ngRoute', 'ngLocale',
                           'espa.crudRest', 'espa.publicOAuth', 'espa.spinner', 'espa.modal', 'espa.grid', 'espa.validations',
                           'espa.intranet', 'espa.errorHandling', 'espa.webapi']);

})();