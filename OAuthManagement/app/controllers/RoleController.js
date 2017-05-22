'use strict';

angular.module('app')
    .controller('RoleController', RoleController);

RoleController.$inject = ['$scope', 'modalService', '$modal', 'toaster', 'webapiConstants', 'jumuroCrudRESTService', 'webapiAppConfigConstants'];

function RoleController($scope, modalService, $modal, toaster, webapiConstants, jumuroCrudRESTService, webapiAppConfigConstants) {
    //#region Private Methods

    //Set the roles grid configuration
    var configureRolesGrid = function () {
        var columnList = [
            { name: 'name', header: 'Role', isFilter: false, isOrder: true, width: '85%' }
        ];

        $scope.gridRolesOptions = {
            columnList: columnList,
            noDataMessage: 'There are no roles',
            animate: true,
            crudOptions: {
                enable: true,
                insert: {
                    security: {
                        route: '/role',
                        action: 'insert'
                    },
                    method: function () {
                        $scope.openPopup(false, null);
                    }
                },
                edit: {
                    security: {
                        route: '/role',
                        action: 'edit'
                    },
                    method: function (data, index) {
                        $scope.openPopup(true, data);
                    }
                },
                delete: {
                    security: {
                        route: '/role',
                        action: 'delete'
                    },
                    method: function (data, index) {
                        $scope.deleteRole(data);
                    }
                }
            }
        };
    };

    //Get all roles
    var getRoles = function () {
        jumuroCrudRESTService.restGet(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.getRoles, false).then(function (data) {
            $scope.gridRolesOptions.dataList = data;
        });
    };

    //#endregion Private Methods

    //#region Scope Methods

    //Initialize page
    $scope.initialize = function () {
        configureRolesGrid();
        getRoles();
    };

    //Open Add/Edit popup
    $scope.openPopup = function (isEdit, role) {
        var _roleToEdit = angular.copy(role);

        var modalInstance = $modal.open({
            windowClass: 'modalWindow',
            templateUrl: './app/views/RolePopup.html',
            controller: 'RolePopupController',
            resolve: {
                items: function () {
                    return {
                        isEdit: isEdit,
                        role: _roleToEdit
                    };
                }
            }
        });

        modalInstance.result.then(function (result) {
            if (result.isRefresh) {
                if (result.isEdition) {
                    // Refresh grid after edition
                    for (var i = 0; i < $scope.gridRolesOptions.dataList.length; i++) {
                        if ($scope.gridRolesOptions.dataList[i].id == result.role.id) {
                            $scope.gridRolesOptions.dataList[i] = result.role;
                            break;
                        }
                    }
                }
                else {
                    // Refresh grid after insertion
                    $scope.gridRolesOptions.dataList.push(result.role);
                }
            }
        }, function () {

        });
    };

    //Open confirm popup to delete role
    $scope.deleteRole = function (role) {
        //build the details list
        //check if the user has the requested permission
        var details = [
            { name: "Name", value: role.name }
        ];

        var modalOptions = {
            headerText: 'Please Confirm',
            message: 'Are you sure you want to delete this role?',
            buttons: { ok: 'Yes', cancel: 'No' },
            modalType: 'confirm',
            details: details
        };

        var modal = modalService.modal(modalOptions);
        modal.then(function (result) {
            jumuroCrudRESTService.restDelete(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.deleteRole.replace("{roleId}", role.id), false).then(function (data) {
                var originalIndex = $scope.gridRolesOptions.dataList.indexOf(role);
                if (originalIndex != -1) {
                    $scope.gridRolesOptions.dataList.splice(originalIndex, 1);
                }
            });
        }, function () {

        });
    }

    //#endregion Scope Methods
}