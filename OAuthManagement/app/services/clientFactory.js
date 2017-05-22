(function () {
    'use strict';

    angular
        .module('app')
        .factory('clientFactory', clientFactory);

    clientFactory.$inject = ['webapiConstants', 'jumuroCrudRESTService', 'webapiAppConfigConstants'];

    function clientFactory(webapiConstants, jumuroCrudRESTService, webapiAppConfigConstants) {
        var service = {
            getClientsForSetup: getClientsForSetup,
            createClient: createClient,
            updateClient: updateClient,
            deleteClient: deleteClient
        };

        return service;

        function getClientsForSetup() {
            return jumuroCrudRESTService.restGet(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.clientsSetup, false)
                .then(getClientsForSetupComplete)
                .catch(getClientsForSetupFailed);

            function getClientsForSetupComplete(data) {
                return data;
            }

            function getClientsForSetupFailed(error) {
                //Log error
                return $q.reject(error);
            }
        }

        function createClient(client) {
            return jumuroCrudRESTService.restPost(client, webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.postClient, false)
                .then(createClientComplete)
                .catch(createClientFailed);

            function createClientComplete(data) {
                return data;
            }

            function createClientFailed(error) {
                //Log error
                return $q.reject(error);
            }
        }

        function updateClient(client) {
            return jumuroCrudRESTService.restPut(client, webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.putClient, false)
                .then(updateClientComplete)
                .catch(updateClientFailed);

            function updateClientComplete(data) {
                return data;
            }

            function updateClientFailed(error) {
                //Log error
                return $q.reject(error);
            }
        }

        function deleteClient(clientId) {
            return jumuroCrudRESTService.restDelete(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.deleteClient.replace("{clientId}", clientId), false)
                .then(deleteClientComplete)
                .catch(deleteClientFailed);

            function deleteClientComplete(data) {
                return data;
            }

            function deleteClientFailed(error) {
                //Log error
                return $q.reject(error);
            }
        }
    }
})();