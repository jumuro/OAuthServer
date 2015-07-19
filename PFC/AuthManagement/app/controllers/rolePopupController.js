'use strict';

angular.module('app')
    .controller('RolePopupController', RolePopupController);

RolePopupController.$inject = ['$scope', '$modalInstance', 'webapiConstants', 'espaCrudRESTService', 'items', 'webapiAppConfigConstants'];

function RolePopupController($scope, $modalInstance, webapiConstants, espaCrudRESTService, items, webapiAppConfigConstants) {
    //#region Scope Methods

    //Initialize page
    $scope.initialize = function () {
        $scope.form = {};
        $scope.resultPopUp = {
            isRefresh: false,
            role: []
        };
        $scope.role = items.role;
        $scope.isEdit = items.isEdit;

        if (items.isEdit) {
            $scope.popupHeaderText = 'Edit';
            $scope.popupOkText = 'Update';
        }
        else {
            $scope.popupHeaderText = 'Add';
            $scope.popupOkText = 'Add';
        }
    };

    $scope.ok = function () {
        //Mark as refresh
        $scope.resultPopUp.isRefresh = true;

        if (items.isEdit) {
            espaCrudRESTService.restPut($scope.role, webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.putRole, false).then(function (data) {
                //Mark as edition
                $scope.resultPopUp.isEdition = true;

                //Set modified role
                $scope.resultPopUp.role = data;

                //Close popup
                $modalInstance.close($scope.resultPopUp);
            });
        }
        else {
            espaCrudRESTService.restPost($scope.role, webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.postRole, false).then(function (data) {
                //Mark as edition
                $scope.resultPopUp.isEdition = false;

                //Set added role
                $scope.resultPopUp.role = data;

                //Close popup
                $modalInstance.close($scope.resultPopUp);
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //#endregion Scope Methods
}