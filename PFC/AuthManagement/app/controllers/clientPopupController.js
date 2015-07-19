'use strict';

angular.module('app')
    .controller('ClientPopupController', ClientPopupController);

ClientPopupController.$inject = ['$scope', '$modalInstance', 'webapiConstants', 'espaCrudRESTService', 'items', 'webapiAppConfigConstants'];

function ClientPopupController($scope, $modalInstance, webapiConstants, espaCrudRESTService, items, webapiAppConfigConstants) {
    //#region Scope Methods

    //Initialize page
    $scope.initialize = function () {
        $scope.form = {};
        $scope.resultPopUp = {
            isRefresh: false,
            client: []
        };
        $scope.client = items.client;
        $scope.applicationTypes = items.applicationTypes;
        $scope.isEdit = items.isEdit;

        if (items.isEdit) {
            // Select current application type of the client
            for (var i = 0; i < $scope.applicationTypes.length; i++) {
                if ($scope.client.applicationType.id == $scope.applicationTypes[i].id) {
                    $scope.client.applicationType = $scope.applicationTypes[i];
                    break;
                }
            }

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
            espaCrudRESTService.restPut($scope.client, webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.putClient, false).then(function (data) {
                //Mark as edition
                $scope.resultPopUp.isEdition = true;

                //Set modified client
                $scope.resultPopUp.client = data;

                //Close popup
                $modalInstance.close($scope.resultPopUp);
            });
        }
        else {
            espaCrudRESTService.restPost($scope.client, webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.postClient, false).then(function (data) {
                //Mark as edition
                $scope.resultPopUp.isEdition = false;

                //Set added client
                $scope.resultPopUp.client = data;

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