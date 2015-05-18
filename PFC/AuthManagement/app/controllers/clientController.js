'use strict';

angular.module('app')
    .controller('clientCtrl', clientCtrl);

clientCtrl.$inject = ['$scope', 'modalService', '$modal', 'toaster', 'webapiConstants', 'espaCrudRESTService', 'webapiAppConfigConstants'];

function clientCtrl($scope, modalService, $modal, toaster, webapiConstants, espaCrudRESTService, webapiAppConfigConstants) {
    //#region Private Methods

    //Set the clients grid configuration
    var configureClientsGrid = function () {
        var columnList = [
            { name: 'clientId', header: 'Client Id', isFilter: false, isOrder: true },
            { name: 'description', header: 'Description', isFilter: false, isOrder: true },
            { name: 'applicationType.description', header: 'Application Type', isFilter: false, isOrder: true },
            { name: 'accessTokenExpireTime', header: 'Access Token Expire Time', isFilter: false, isOrder: true },
            { name: 'refreshTokenLifeTime', header: 'Refresh Token Life Time', isFilter: false, isOrder: true },
            { name: 'allowedOrigin', header: 'Allowed Origin', isFilter: true, isOrder: true },
            { name: 'isActive', header: 'Is Active', isFilter: true, isOrder: true }
        ];

        $scope.gridClientsOptions = {
            columnList: columnList,
            noDataMessage: 'There are no clients',
            animate: true,
            crudOptions: {
                enable: true,
                insert: {
                    security: {
                        route: '/client',
                        action: 'insert'
                    },
                    method: function () {
                        $scope.openPopup(false, null);
                    }
                },
                edit: {
                    security: {
                        route: '/client',
                        action: 'edit'
                    },
                    method: function (data) {
                        $scope.openPopup(true, data);
                    }
                },
                delete: {
                    security: {
                        route: '/client',
                        action: 'delete'
                    },
                    method: function (data) {
                        $scope.deleteClient(data);
                    }
                }
            }
        };
    };

    //Get all clients for setup
    var getClientsForSetup = function () {
        espaCrudRESTService.restGet(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.clientsSetup, false).then(function (data) {
            $scope.gridClientsOptions.dataList = data.clients;
            $scope.applicationTypes = data.applicationTypes;
        });
    };

    //#endregion Private Methods

    //#region Scope Methods

    //Initialize page
    $scope.initialize = function () {
        configureClientsGrid();
        getClientsForSetup();
    };

    //Open Add/Edit popup
    $scope.openPopup = function (isEdit, client) {
        var _clientToEdit = angular.copy(client);

        var modalInstance = $modal.open({
            windowClass: 'modalWindow',
            templateUrl: './app/views/ClientPopup.html',
            controller: 'clientPopupCtrl',
            resolve: {
                items: function () {
                    return {
                        isEdit: isEdit,
                        client: _clientToEdit,
                        applicationTypes: $scope.applicationTypes
                    };
                }
            }
        });

        modalInstance.result.then(function (result) {
            if (result.isRefresh) {
                if (result.isEdition) {
                    // Refresh grid after edition
                    for (var i = 0; i < $scope.gridClientsOptions.dataList.length; i++) {
                        if ($scope.gridClientsOptions.dataList[i].clientId == result.client.clientId) {
                            $scope.gridClientsOptions.dataList[i] = result.client;
                            break;
                        }
                    }
                }
                else {
                    // Refresh grid after insertion
                    $scope.gridClientsOptions.dataList.push(result.client);
                }
            }
        }, function () {

        });
    };

    //Open confirm popup to delete client
    $scope.deleteClient = function (client, index) {
        //build the details list
        //check if the user has the requested permission
        var details = [
            {
                name: "Client Id", value: client.clientId
            },
            {
                name: "Description", value: client.description,
            }
        ];

        var modalOptions = {
            headerText: 'Please Confirm',
            message: 'Are you sure you want to delete this client?',
            buttons: { ok: 'Yes', cancel: 'No' },
            modalType: 'confirm',
            details: details
        };

        var modal = modalService.modal(modalOptions);
        modal.then(function (result) {
            espaCrudRESTService.restDelete(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.deleteClient.replace("{clientId}", client.clientId), false).then(function (data) {
                //$scope.gridClientsOptions.dataList.splice(index, 1);

                var originalIndex = $scope.gridClientsOptions.dataList.indexOf(client);
                if (originalIndex != -1) {
                    $scope.gridClientsOptions.dataList.splice(originalIndex, 1);
                }
            });
        }, function () {

        });
    }

    //#endregion Scope Methods
}