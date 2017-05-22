'use strict';

angular.module('app')
    .controller('UserController', UserController);

UserController.$inject = ['$scope', 'modalService', '$modal', 'toaster', 'webapiConstants', 'jumuroCrudRESTService', 'webapiAppConfigConstants'];

function UserController($scope, modalService, $modal, toaster, webapiConstants, jumuroCrudRESTService, webapiAppConfigConstants) {
    //#region Private Methods

    //Set the users grid configuration
    var configureUsersGrid = function () {
        var columnList = [
            { name: 'userName', header: 'User Name', isFilter: false, isOrder: true },
            { name: 'email', header: 'Email', isFilter: false, isOrder: true },
            { name: 'client.clientId', header: 'Client Id', isFilter: false, isOrder: true },
            { name: 'role.name', header: 'Role Name', isFilter: false, isOrder: true },
            { name: 'isActive', header: 'Is Active', isFilter: true, isOrder: true }
        ];

        $scope.gridUsersOptions = {
            columnList: columnList,
            noDataMessage: 'There are no users',
            animate: true,
            crudOptions: {
                enable: true,
                insert: {
                    security: {
                        route: '/user',
                        action: 'insert'
                    },
                    method: function () {
                        $scope.openPopup(false, null);
                    }
                },
                edit: {
                    security: {
                        route: '/user',
                        action: 'edit'
                    },
                    method: function (data, index) {
                        $scope.openPopup(true, data);
                    }
                },
                delete: {
                    security: {
                        route: '/user',
                        action: 'delete'
                    },
                    method: function (data, index) {
                        $scope.deleteUser(data);
                    }
                }
            }
        };
    };

    //Get all users for setup
    var getUsersForSetup = function () {
        jumuroCrudRESTService.restGet(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.usersSetup, false).then(function (data) {
            $scope.gridUsersOptions.dataList = data.users;
            $scope.roles = data.roles;
            $scope.clients = data.clients;
        });
    };

    //#endregion Private Methods

    //#region Scope Methods

    //Initialize page
    $scope.initialize = function () {
        configureUsersGrid();
        getUsersForSetup();
    };

    //Open Add/Edit popup
    $scope.openPopup = function (isEdit, user) {
        var _userToEdit = angular.copy(user);

        var modalInstance = $modal.open({
            windowClass: 'modalWindow',
            templateUrl: './app/views/UserPopup.html',
            controller: 'UserPopupController',
            resolve: {
                items: function () {
                    return {
                        isEdit: isEdit,
                        user: _userToEdit,
                        roles: $scope.roles,
                        clients: $scope.clients
                    };
                }
            }
        });

        modalInstance.result.then(function (result) {
            if (result.isRefresh) {
                if (result.isEdition) {
                    // Refresh grid after edition
                    for (var i = 0; i < $scope.gridUsersOptions.dataList.length; i++) {
                        if ($scope.gridUsersOptions.dataList[i].userId == result.user.userId) {
                            $scope.gridUsersOptions.dataList[i] = result.user;
                            break;
                        }
                    }
                }
                else {
                    // Refresh grid after insertion
                    $scope.gridUsersOptions.dataList.push(result.user);
                }
            }
        }, function () {

        });
    };

    //Open confirm popup to delete user
    $scope.deleteUser = function (user) {
        //build the details list
        //check if the user has the requested permission
        var details = [
            {
                name: "User Name", value: user.userName
            }
        ];

        var modalOptions = {
            headerText: 'Please Confirm',
            message: 'Are you sure you want to delete this user?',
            buttons: { ok: 'Yes', cancel: 'No' },
            modalType: 'confirm',
            details: details
        };

        var modal = modalService.modal(modalOptions);
        modal.then(function (result) {
            jumuroCrudRESTService.restDelete(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.deleteUser.replace("{userId}", user.userId), false).then(function (data) {
                var originalIndex = $scope.gridUsersOptions.dataList.indexOf(user);
                if (originalIndex != -1) {
                    $scope.gridUsersOptions.dataList.splice(originalIndex, 1);
                }
            });
        }, function () {

        });
    }

    //#endregion Scope Methods
}