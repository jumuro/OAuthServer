'use strict';

angular.module('app')
    .controller('refreshTokenCtrl', refreshTokenCtrl);

refreshTokenCtrl.$inject = ['$scope', 'modalService', 'toaster', 'webapiConstants', 'espaCrudRESTService', 'webapiAppConfigConstants'];

function refreshTokenCtrl($scope, modalService, toaster, webapiConstants, espaCrudRESTService, webapiAppConfigConstants) {
    //#region Private Methods

    //Set the refresh tokens grid configuration
    var configureRefreshTokensGrid = function () {
        var columnList = [
            { name: 'refreshTokenId', header: 'Refresh Token Id', isFilter: false, isOrder: false },
            { name: 'userName', header: 'User', isFilter: false, isOrder: false },
            { name: 'clientId', header: 'Client', isFilter: false, isOrder: false },
            { name: 'issuedUtc', header: 'Issued At (UTC)', isFilter: false, isOrder: false },
            { name: 'expiresUtc', header: 'Expires At (UTC)', isFilter: false, isOrder: false }
        ];

        $scope.gridRefreshTokensOptions = {

            columnList: columnList,
            noDataMessage: 'There are no refresh tokens',
            animate: true,
            crudOptions: {
                enable: true,
                delete: {
                    security: {
                        route: '/refreshToken',
                        action: 'delete'
                    },
                    method: function (data) {
                        $scope.deleteRefreshToken(data);
                    }
                }
            },
            infiniteScroll: {
                isActive: true,
                distance: 0,
                perPage: 12,
                initialLoad: 30
            }
        };
    };

    //Get all refreshTokens
    var getRefreshTokens = function () {
        espaCrudRESTService.restGet(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.getRefreshTokens, false).then(function (data) {
            $scope.gridRefreshTokensOptions.dataList = data;
        });
    };

    //#endregion Private Methods

    //#region Scope Methods

    //Initialize page
    $scope.initialize = function () {
        configureRefreshTokensGrid();
        getRefreshTokens();
    };

    //Initialize page
    $scope.getRefreshTokens = function () {
        getRefreshTokens();
    };

    //Open confirm popup to delete refreshToken
    $scope.deleteRefreshToken = function (refreshToken) {
        //build the details list
        //check if the user has the requested permission
        var details = [
            {
                name: "Refresh Token Id", value: refreshToken.refreshTokenId
            },
            {
                name: "User Name", value: refreshToken.userName
            },
            {
                name: "Client Id", value: refreshToken.clientId
            },
            {
                name: "Issued At (UTC)", value: refreshToken.issuedUtc
            },
            {
                name: "Expires At (UTC)", value: refreshToken.expiresUtc
            }
        ];

        var modalOptions = {
            headerText: 'Please Confirm',
            message: 'Are you sure you want to delete this refreshToken?',
            buttons: { ok: 'Yes', cancel: 'No' },
            modalType: 'confirm',
            details: details
        };

        var modal = modalService.modal(modalOptions);
        modal.then(function (result) {
            // The RefreshTokenId is the hash of a Guid. It can contain symbols like '+' or '/'. Encode refreshTokenId with window.encodeURIComponent() function.
            var refreshTokenId = window.encodeURIComponent(refreshToken.refreshTokenId);
            espaCrudRESTService.restDelete(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.deleteRefreshToken.replace("{refreshTokenId}", refreshTokenId), false).then(function (data) {
                //$scope.gridRefreshTokensOptions.dataList.splice(index, 1);
                
                var originalIndex = $scope.gridRefreshTokensOptions.dataList.indexOf(refreshToken);
                if (originalIndex != -1) {
                    $scope.gridRefreshTokensOptions.dataList.splice(originalIndex, 1);
                }
            });
        }, function () {

        });
    }

    //#endregion Scope Methods
}