///#source 1 1 /appNugets/Jumuro.Angular.Modal/module.js
(function () {
    'use strict';
    angular.module('jumuro.modal', ['ui.bootstrap.modal', 'ui.bootstrap.tpls']);
})();
///#source 1 1 /appNugets/Jumuro.Angular.Modal/services/modalService.js
(function () {
    /// <reference path="../views/modalConfirm.html" />
    'use strict';

    angular.module('jumuro.modal')
        .factory('modalService', modalService);

    modalService.$inject = ['$modal'];

    function modalService($modal) {
        return {
            modal: modal
        }

        function modal(modalOptions) {
            var _templateUrl = './appNugets/Jumuro.Angular.Modal/templates/modalNotification.html';

            if (modalOptions.modalType == 'confirm') {
                _templateUrl = './appNugets/Jumuro.Angular.Modal/templates/modalConfirm.html';
            }
            else if (modalOptions.modalType == 'error') {
                _templateUrl = './appNugets/Jumuro.Angular.Modal/templates/modalError.html?v1';
            }
            else if (modalOptions.modalType == 'notification') {
                _templateUrl = './appNugets/Jumuro.Angular.Modal/templates/modalNotification.html';
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
        }
    }
})();
///#source 1 1 /appNugets/Jumuro.Angular.Modal/controllers/modalController.js
'use strict';

// Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
//'mgcrea.ngStrap'
angular.module('jumuro.modal')
    .controller('modalInstanceCtrl', modalInstanceCtrl);

modalInstanceCtrl.$inject = ['$scope', '$modalInstance', 'modalScope'];

function modalInstanceCtrl($scope, $modalInstance, modalScope) {
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
}

