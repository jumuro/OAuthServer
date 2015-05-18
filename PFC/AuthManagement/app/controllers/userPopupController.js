'use strict';

angular.module('app')
    .controller('userPopupCtrl', userPopupCtrl);

userPopupCtrl.$inject = ['$scope', '$modalInstance', 'webapiConstants', 'espaCrudRESTService', 'items', 'webapiAppConfigConstants'];

function userPopupCtrl($scope, $modalInstance, webapiConstants, espaCrudRESTService, items, webapiAppConfigConstants) {
    //#region Scope Methods

    //Initialize page
    $scope.initialize = function () {
        $scope.form = {};
        $scope.resultPopUp = {
            isRefresh: false,
            client: []
        };
        $scope.user = items.user;
        $scope.roles = items.roles;
        $scope.clients = items.clients;
        $scope.isEdit = items.isEdit;

        if (items.isEdit) {
            // Select current role and client of the user
            for (var i = 0; i < $scope.roles.length; i++) {
                if ($scope.user.role.id == $scope.roles[i].id) {
                    $scope.user.role = $scope.roles[i];
                    break;
                }
            }

            for (var i = 0; i < $scope.clients.length; i++) {
                if ($scope.user.client.clientId == $scope.clients[i].clientId) {
                    $scope.user.client = $scope.clients[i];
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
            espaCrudRESTService.restPut($scope.user, webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.putUser, false).then(function (data) {
                //Mark as edition
                $scope.resultPopUp.isEdition = true;

                //Set modified user
                $scope.resultPopUp.user = data;

                //Close popup
                $modalInstance.close($scope.resultPopUp);
            });
        }
        else {
            espaCrudRESTService.restPost($scope.user, webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.postUser, false).then(function (data) {
                //Mark as edition
                $scope.resultPopUp.isEdition = false;

                //Set added user
                $scope.resultPopUp.user = data;

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