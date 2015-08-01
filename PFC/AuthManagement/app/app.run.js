(function () {
    'use strict';

    angular
        .module('app')
        .run(runBlock);

    runBlock.$inject = ['$rootScope'];

    function runBlock($rootScope) {
        $rootScope.title = "";

        $rootScope.$on('$routeChangeError', function (event, current, previous, error) {
            if (error.status === 404) {
                $location.path('/home');
            }
        });
    }
})();