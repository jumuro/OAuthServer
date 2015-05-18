///#source 1 1 /appNugets/Espa.Angular.Modal/module.js
angular.module('espa.modal', ['ui.bootstrap.modal', 'ui.bootstrap.tpls']);
///#source 1 1 /appNugets/Espa.Angular.Modal/services/modalService.js
/// <reference path="../views/modalConfirm.html" />
'use strict';

angular.module('espa.modal')
.service('modalService', ['$modal', function ($modal) {

    var modal = function (modalOptions) {

        var _templateUrl = './appNugets/Espa.Angular.Modal/templates/modalNotification.html';

        if (modalOptions.modalType == 'confirm') {
            _templateUrl = './appNugets/Espa.Angular.Modal/templates/modalConfirm.html';
        }
        else if (modalOptions.modalType == 'error') {
            _templateUrl = './appNugets/Espa.Angular.Modal/templates/modalError.html?v1';
        }
        else if (modalOptions.modalType == 'notification') {
            _templateUrl = './appNugets/Espa.Angular.Modal/templates/modalNotification.html';
        }

        var modalInstance = $modal.open({
            templateUrl: _templateUrl,
            controller: 'modalInstanceCtrl',
            resolve: {
                modalScope: function () {
                    return modalOptions;
                }
            }
        });

        return modalInstance.result;
    };
    return {
        modal: function (modalOptions) {
            return modal(modalOptions);
        }
    }
}]);
///#source 1 1 /appNugets/Espa.Angular.Modal/controllers/modalController.js
'use strict';

// Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
//'mgcrea.ngStrap'
var app = angular.module('espa.modal')
.controller('modalInstanceCtrl', ['$scope', '$modalInstance', 'modalScope', function ($scope, $modalInstance, modalScope) {
    $scope.buttons = modalScope.buttons;
    $scope.message = modalScope.message;
    $scope.headerText = modalScope.headerText;
    $scope.details = modalScope.details;

    $scope.ok = function () {
        $modalInstance.close(true);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

