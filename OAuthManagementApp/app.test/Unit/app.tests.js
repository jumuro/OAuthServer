'use strict';

describe('appModule: UT', function () {
    var $scope, $rootScope, createController;

    beforeEach(function () {
        module('app'); // <= initialize module that should be tested
    });

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();

    }));

    it('should set a page title', function () {
        expect($scope.$root.title).not.toBe(' ');
    });
});


