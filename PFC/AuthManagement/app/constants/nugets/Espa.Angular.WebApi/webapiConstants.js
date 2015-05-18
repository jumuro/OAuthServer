'use strict';

angular.module('app')
.constant('webapiConstants', {
    urls: {
        ApiUrl: {
            getRoles: 'authserver/roles',
            getRoleById: 'authserver/roles/{roleId}',
            getRoleByName: 'authserver/roles/{roleName}',
            postRole: 'authserver/roles',
            putRole: 'authserver/roles',
            deleteRole: 'authserver/roles/{roleId}',
            getClients: 'authserver/clients',
            getClient: 'authserver/clients/{clientId}',
            postClient: 'authserver/clients',
            putClient: 'authserver/clients',
            deleteClient: 'authserver/clients/{clientId}',
            clientsSetup: 'authserver/clients/setup',
            postUser: 'authserver/users',
            putUser: 'authserver/users',
            deleteUser: 'authserver/users/{userId}',
            usersSetup: 'authserver/users/setup',
            getRefreshTokens: 'authserver/refreshTokens',
            // The RefreshTokenId is the hash of a Guid. It can contain symbols like '+' or '/'. Then we post the refreshTokenId in query string instead of a route parameter.
            deleteRefreshToken: 'authserver/refreshTokens/?refreshTokenId={refreshTokenId}'
        }
    }
});