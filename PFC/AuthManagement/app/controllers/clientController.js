(function() {
    'use strict';

    angular.module('app')
        .controller('ClientCtrl', ClientCtrl);

    ClientCtrl.$inject = ['modalService', '$modal', 'toaster', 'clientFactory'];

    function ClientCtrl(modalService, $modal, toaster, clientFactory) {
        var vm = this;

        vm.applicationTypes = [];
        vm.deleteClient = deleteClient;
        vm.gridClientsOptions = {};
        vm.openPopup = openPopup;
        






        // IS THIS NECESSARY?? I THINK NOT
        //var configureClientsGrid = configureClientsGrid;
        //var getClientsForSetup = getClientsForSetup;








        initialize(); // activate();

        //#region Scope Methods

        //Initializes page
        function initialize() {
            configureClientsGrid();
            getClientsForSetup();
        }

        //Open Add/Edit popup
        function openPopup(isEdit, client) {
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
                            applicationTypes: vm.applicationTypes
                        };
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if (result.isRefresh) {
                    if (result.isEdition) {
                        // Refresh grid after edition
                        for (var i = 0; i < vm.gridClientsOptions.dataList.length; i++) {
                            if (vm.gridClientsOptions.dataList[i].clientId == result.client.clientId) {
                                vm.gridClientsOptions.dataList[i] = result.client;
                                break;
                            }
                        }
                    }
                    else {
                        // Refresh grid after insertion
                        vm.gridClientsOptions.dataList.push(result.client);
                    }
                }
            }, function () {

            });
        };

        //Open confirm popup to delete client
        function deleteClient(client, index) {
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
                clientFactory.deleteClient(client.cliendId)
                    .then(function (data) {
                        //vm.gridClientsOptions.dataList.splice(index, 1);

                        var originalIndex = vm.gridClientsOptions.dataList.indexOf(client);
                        if (originalIndex != -1) {
                            vm.gridClientsOptions.dataList.splice(originalIndex, 1);
                    }
                });
            }, function () {

            });
        }

        //#endregion Scope Methods

        //#region Private Methods

        //Set the clients grid configuration
        function configureClientsGrid()
        { 
            var columnList = [
                { name: 'clientId', header: 'Client Id', isFilter: false, isOrder: true },
                { name: 'description', header: 'Description', isFilter: false, isOrder: true },
                { name: 'applicationType.description', header: 'Application Type', isFilter: false, isOrder: true },
                { name: 'accessTokenExpireTime', header: 'Access Token Expire Time', isFilter: false, isOrder: true },
                { name: 'refreshTokenLifeTime', header: 'Refresh Token Life Time', isFilter: false, isOrder: true },
                { name: 'allowedOrigin', header: 'Allowed Origin', isFilter: true, isOrder: true },
                { name: 'isActive', header: 'Is Active', isFilter: true, isOrder: true }
            ];

            this.gridClientsOptions = {
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
                            openPopup(false, null);
                        }
                    },
                    edit: {
                        security: {
                            route: '/client',
                            action: 'edit'
                        },
                        method: function (data) {
                            openPopup(true, data);
                        }
                    },
                    delete: {
                        security: {
                            route: '/client',
                            action: 'delete'
                        },
                        method: function (data) {
                            deleteClient(data);
                        }
                    }
                }
            };
        }

        //Get all clients for setup
        function getClientsForSetup()
        {
            clientFactory.getClientsForSetup()
                .then(function (data) {
                    vm.gridClientsOptions.dataList = data.clients;
                    vm.applicationTypes = data.applicationTypes;
                });
        }

        //#endregion Private Methods
    }
})();