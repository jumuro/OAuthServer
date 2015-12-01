(function () {
    'use strict';

    angular.module('app')
        .controller('ClientPopupController', ClientPopupController);

    ClientPopupController.$inject = ['$modalInstance', 'webapiConstants', 'items', 'webapiAppConfigConstants', 'clientFactory'];

    function ClientPopupController($modalInstance, webapiConstants, items, webapiAppConfigConstants, clientFactory) {
        var vm = this;

        vm.form = {};
        vm.resultPopUp = {
            isRefresh: false,
            client: []
        };
        vm.client = items.client;
        vm.applicationTypes = items.applicationTypes;
        vm.isEdit = items.isEdit;
        vm.popupHeaderText = '';
        vm.popupOkText = '';
        vm.ok = ok;
        vm.cancel = cancel;

        initialize();

        //#region Scope Methods

        function ok() {
            //Mark as refresh
            vm.resultPopUp.isRefresh = true;

            if (items.isEdit) {
                clientFactory.updateClient(vm.client)
                    .then(function (data) {
                        //Mark as edition
                        vm.resultPopUp.isEdition = true;

                        //Set modified client
                        vm.resultPopUp.client = data;

                        //Close popup
                        $modalInstance.close(vm.resultPopUp);
                });
            }
            else {
                clientFactory.createClient(vm.client)
                    .then(function (data) {
                    //Mark as edition
                    vm.resultPopUp.isEdition = false;

                    //Set added client
                    vm.resultPopUp.client = data;

                    //Close popup
                    $modalInstance.close(vm.resultPopUp);
                });
            }
        }

        function cancel() {
            $modalInstance.dismiss('cancel');
        }

        //#endregion Scope Methods

        //#region Private Methods

        //Initialize page
        function initialize() {
            if (items.isEdit) {
                // Select current application type of the client
                for (var i = 0; i < vm.applicationTypes.length; i++) {
                    if (vm.client.applicationType.id == vm.applicationTypes[i].id) {
                        vm.client.applicationType = vm.applicationTypes[i];
                        break;
                    }
                }

                vm.popupHeaderText = 'Edit';
                vm.popupOkText = 'Update';
            }
            else {
                vm.popupHeaderText = 'Add';
                vm.popupOkText = 'Add';
            }
        };

        //#endregion Private Methods
    }
})();