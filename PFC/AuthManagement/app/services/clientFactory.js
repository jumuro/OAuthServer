(function () {
    'use strict';

    angular
        .module('app')
        .factory('clientFactory', clientFactory);

    clientFactory.$inject = ['webapiConstants', 'jumuroCrudRESTService', 'webapiAppConfigConstants'];

    function clientFactory(webapiConstants, espaCrudRESTService, webapiAppConfigConstants) {
        var service = {
            getClientsForSetup: getClientsForSetup,
            deleteClient: deleteClient
        };

        return service;

        function getClientsForSetup() {
            return espaCrudRESTService.restGet(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.clientsSetup, false)
                .then(getClientsForSetupComplete)
                .catch(getClientsForSetupFailed);

            function getClientsForSetupComplete(data) {
                return data;
            }

            function getClientsForSetupFailed(error) {
                //Log error
            }
        }

        function deleteClient(clientId) {
            return espaCrudRESTService.restDelete(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.deleteClient.replace("{clientId}", clientId), false)
                .then(deleteClientComplete)
                .catch(deleteClientFailed);

            function deleteClientComplete(data) {
                return data;
            }

            function deleteClientFailed(error) {
                //Log error
            }
        }
    }


})();