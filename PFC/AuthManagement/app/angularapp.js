///#source 1 1 /app/app.js
(function () {
    'use strict';

    // Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
    //'mgcrea.ngStrap'
    angular.module('app', ['ngRoute', 'ngLocale',
                           'espa.crudRest', 'espa.publicOAuth', 'espa.spinner', 'espa.modal', 'espa.grid', 'espa.validations',
                           'espa.intranet', 'espa.errorHandling', 'espa.webapi']);

})();
///#source 1 1 /app/app.config.js
(function () {
    'use strict';

    angular.module('app')
        .config(configure);

    configure.$inject = ['$locationProvider', '$httpProvider'];

    function configure($locationProvider, $httpProvider) {
        $httpProvider.interceptors.push('httpInterceptorService');

        //$locationProvider.html5Mode(true);
    }
})();
///#source 1 1 /app/app.config.route.js
(function () {
    'use strict';

    angular.module('app')
        .config(configureRoute);

    configureRoute.$inject = ['$routeProvider'];

    function configureRoute($routeProvider) {
        $routeProvider.
            when('/role', {
                templateUrl: './app/views/role.html',
                controller: 'roleCtrl',
                menuTitle: 'Roles',
                levelTree: [{ title: "Security", icon: "fa fa-lock" }, { title: "Auth Management", icon: "" }, { title: "Roles", icon: "" }]
            }).
            when('/client', {
                templateUrl: './app/views/client.html',
                controller: 'ClientCtrl',
                controllerAs: 'vm',
                menuTitle: 'Clients',
                levelTree: [{ title: "Security", icon: "fa fa-lock" }, { title: "Auth Management", icon: "" }, { title: "Clients", icon: "" }]
            }).
            when('/refreshToken', {
                templateUrl: './app/views/refreshtoken.html',
                controller: 'refreshTokenCtrl',
                menuTitle: 'RefreshTokens',
                levelTree: [{ title: "Security", icon: "fa fa-lock" }, { title: "Auth Management", icon: "" }, { title: "RefreshTokens", icon: "" }]
            }).
            when('/user', {
                templateUrl: './app/views/user.html',
                controller: 'userCtrl',
                menuTitle: 'Users',
                levelTree: [{ title: "Security", icon: "fa fa-lock" }, { title: "Auth Management", icon: "" }, { title: "Users", icon: "" }]
            })
            //otherwise({ redirectTo: '/role' });
    }
})();
///#source 1 1 /app/app.run.js
(function () {
    'use strict';

    angular
        .module('app')
        .run(runBlock);

    runBlock.$inject = ['$rootScope'];

    function runBlock(rootScope) {
        $rootScope.title = "";

        $rootScope.$on('$routeChangeError', function (event, current, previous, error) {
            if (error.status === 404) {
                $location.path('/home');
            }
        });
    }
})();
///#source 1 1 /app/controllers/appController.js
(function () {
    'use strict';

    // Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
    //'mgcrea.ngStrap'
    angular.module('app')
        .controller('appCtrl', appCtrl);

    appCtrl.$inject = ['$scope', 'webapiConstants'];

    function appCtrl($scope, webapiConstants) {

    }
})();
///#source 1 1 /app/controllers/clientController.js
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
///#source 1 1 /app/controllers/clientPopupController.js
'use strict';

angular.module('app')
    .controller('clientPopupCtrl', clientPopupCtrl);

clientPopupCtrl.$inject = ['$scope', '$modalInstance', 'webapiConstants', 'espaCrudRESTService', 'items', 'webapiAppConfigConstants'];

function clientPopupCtrl($scope, $modalInstance, webapiConstants, espaCrudRESTService, items, webapiAppConfigConstants) {
    //#region Scope Methods

    //Initialize page
    $scope.initialize = function () {
        $scope.form = {};
        $scope.resultPopUp = {
            isRefresh: false,
            client: []
        };
        $scope.client = items.client;
        $scope.applicationTypes = items.applicationTypes;
        $scope.isEdit = items.isEdit;

        if (items.isEdit) {
            // Select current application type of the client
            for (var i = 0; i < $scope.applicationTypes.length; i++) {
                if ($scope.client.applicationType.id == $scope.applicationTypes[i].id) {
                    $scope.client.applicationType = $scope.applicationTypes[i];
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
            espaCrudRESTService.restPut($scope.client, webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.putClient, false).then(function (data) {
                //Mark as edition
                $scope.resultPopUp.isEdition = true;

                //Set modified client
                $scope.resultPopUp.client = data;

                //Close popup
                $modalInstance.close($scope.resultPopUp);
            });
        }
        else {
            espaCrudRESTService.restPost($scope.client, webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.postClient, false).then(function (data) {
                //Mark as edition
                $scope.resultPopUp.isEdition = false;

                //Set added client
                $scope.resultPopUp.client = data;

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
///#source 1 1 /app/controllers/modalController.js
'use strict';

// Declares how the application should be bootstrapped. See: http://docs.angularjs.org/guide/module
//'mgcrea.ngStrap'
var app = angular.module('app');

app.controller('modalInstanceCtrl', ['$scope', '$modalInstance', 'modalScope', function ($scope, $modalInstance, modalScope) {
    $scope.buttons = modalScope.buttons;
    $scope.message = modalScope.message;
    $scope.headerText = modalScope.headerText;
    $scope.details = modalScope.details;

    $scope.ok = function () {
        $modalInstance.close(true);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

///#source 1 1 /app/controllers/refreshTokenController.js
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
///#source 1 1 /app/controllers/roleController.js
'use strict';

angular.module('app')
    .controller('roleCtrl', roleCtrl);

roleCtrl.$inject = ['$scope', 'modalService', '$modal', 'toaster', 'webapiConstants', 'espaCrudRESTService', 'webapiAppConfigConstants'];

function roleCtrl($scope, modalService, $modal, toaster, webapiConstants, espaCrudRESTService, webapiAppConfigConstants) {
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
        espaCrudRESTService.restGet(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.getRoles, false).then(function (data) {
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
            controller: 'rolePopupCtrl',
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
            espaCrudRESTService.restDelete(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.deleteRole.replace("{roleId}", role.id), false).then(function (data) {
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
///#source 1 1 /app/controllers/rolePopupController.js
'use strict';

angular.module('app')
    .controller('rolePopupCtrl', rolePopupCtrl);

rolePopupCtrl.$inject = ['$scope', '$modalInstance', 'webapiConstants', 'espaCrudRESTService', 'items', 'webapiAppConfigConstants'];

function rolePopupCtrl($scope, $modalInstance, webapiConstants, espaCrudRESTService, items, webapiAppConfigConstants) {
    //#region Scope Methods

    //Initialize page
    $scope.initialize = function () {
        $scope.form = {};
        $scope.resultPopUp = {
            isRefresh: false,
            role: []
        };
        $scope.role = items.role;
        $scope.isEdit = items.isEdit;

        if (items.isEdit) {
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
            espaCrudRESTService.restPut($scope.role, webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.putRole, false).then(function (data) {
                //Mark as edition
                $scope.resultPopUp.isEdition = true;

                //Set modified role
                $scope.resultPopUp.role = data;

                //Close popup
                $modalInstance.close($scope.resultPopUp);
            });
        }
        else {
            espaCrudRESTService.restPost($scope.role, webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.postRole, false).then(function (data) {
                //Mark as edition
                $scope.resultPopUp.isEdition = false;

                //Set added role
                $scope.resultPopUp.role = data;

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
///#source 1 1 /app/controllers/userController.js
'use strict';

angular.module('app')
    .controller('userCtrl', userCtrl);

userCtrl.$inject = ['$scope', 'modalService', '$modal', 'toaster', 'webapiConstants', 'espaCrudRESTService', 'webapiAppConfigConstants'];

function userCtrl($scope, modalService, $modal, toaster, webapiConstants, espaCrudRESTService, webapiAppConfigConstants) {
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
        espaCrudRESTService.restGet(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.usersSetup, false).then(function (data) {
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
            controller: 'userPopupCtrl',
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
            espaCrudRESTService.restDelete(webapiAppConfigConstants.appConfig.ApiURL + webapiConstants.urls.ApiUrl.deleteUser.replace("{userId}", user.userId), false).then(function (data) {
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
///#source 1 1 /app/controllers/userPopupController.js
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
///#source 1 1 /app/directives/matchDirective.js
'use strict';

angular.module('app')
    .directive('match', match);

function match() {
    return {
        require: 'ngModel',
        restrict: 'A',
        scope: {
            match: '='
        },
        link: function (scope, elem, attrs, ctrl) {
            scope.$watch(function () {
                var modelValue = ctrl.$modelValue || ctrl.$$invalidModelValue;
                return (ctrl.$pristine && angular.isUndefined(modelValue)) || scope.match === modelValue;
            }, function (currentValue) {
                ctrl.$setValidity('match', currentValue);
            });
        }
    };
}
///#source 1 1 /app/services/clientFactory.js
(function () {
    'use strict';

    angular
        .module('app')
        .factory('clientFactory', clientFactory);

    clientFactory.$inject = ['webapiConstants', 'jumuroCrudRESTService', 'webapiAppConfigConstants'];

    function clientFactory(webapiConstants, jumuroCrudRESTService, webapiAppConfigConstants) {
        var service = {
            getClientsForSetup: getClientsForSetup,
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
            }
        }
    }


})();
