///#source 1 1 /appNugets/Espa.Angular.IntegratedSecurity/module.js
'use strict';
angular.module('espa.integratedSecurity', ['espa.notificationChannel', 'toaster'])
.run(['$rootScope', 'authService', '$http', '$timeout', function ($rootScope, authService, $http, $timeout) {
    console.log('espa.integratedSecurity run');
    //call the getSecurityInfo when the espa.integratedSecurity is bootstrapped
    authService.getSecurityInfo().then(function (securityInfo) {
        
    });
   
    
    //$rootScope.$evalAsync(function () {
        ////call the getSecurityInfo when the espa.integratedSecurity is bootstrapped
        //authService.getSecurityInfo().then(function (securityInfo) {
        //    authService.setRouteProvider(securityInfo);
        //});
    //});

    //$routeChangeStart listener in order to control the routing access.
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (next.$$route != undefined && next.$$route.originalPath != undefined) {
            var route = next.$$route.originalPath;
            if (next.$$route.anonymous == undefined ||
               (next.$$route.anonymous != undefined && !next.$$route.anonymous)) {
                console.log('authorizeRoute');
                authService.authorizeRoute(route, route.replace("/", ""));
            }

            if (next.$$route.menuTitle) {
                $rootScope.menuTitle = next.$$route.menuTitle;
            }
            if (next.$$route.levelTree) {
                $rootScope.levelTree = next.$$route.levelTree;
            }
        }
    });


}])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/403', {
            templateUrl: 'appNugets/Espa.Angular.IntegratedSecurity/views/403.html',
            anonymous: true
        });

}]);
///#source 1 1 /appNugets/Espa.Angular.IntegratedSecurity/services/notificationChannelAuthtExt.js
'use strict';

angular.module('espa.integratedSecurity')
.service('notificationChannelAuthExt', ['notificationChannel', 'notificationChannelConstants', '$rootScope',
    function (notificationChannel, notificationChannelConstants, $rootScope) {

        notificationChannelConstants.events._END_AUTHENTICATION_ = '_END_AUTHENTICATION_';

        var serviceExtention = angular.extend(notificationChannel, {});

        //broadcast event
        serviceExtention.authEnded = function () {
            $rootScope.$broadcast(notificationChannelConstants.events._END_AUTHENTICATION_);
        };

        //map event to your handler
        serviceExtention.onAuthEnded = function ($scope, handler) {
            $scope.$on(notificationChannelConstants.events._END_AUTHENTICATION_, function (event) {
                handler();
            });
        };
    }]);
///#source 1 1 /appNugets/Espa.Angular.IntegratedSecurity/services/authService.js
'use strict';

angular.module('espa.integratedSecurity')
    .service('authService', ['$http', '$q', 'securityConstants', '$location',
    'toaster', 'notificationChannel', 'notificationChannelAuthExt', '$rootScope', 'integratedSecurityAppConfigConstants',
    function ($http, $q, securityConstants, $location, 
        toaster, notificationChannel, notificationChannelAuthExt, $rootScope, appConfig) {
        
        if (!appConfig.appConfig.securityInfoApiUrl) {
            throw new Error('The -getSecurityInfoApiUrl- appConfig key is not present in the config file of the espa.integratedSecurity module');
        }

        var apiUrl = appConfig.appConfig.securityInfoApiUrl;//appConfig.getApiUrl('espa.integratedSecurity', 'getSecurityInfoApiUrl');

        var oSecurityInfo = {};

        var localStorageName = "SecurityInfo_" + securityConstants.appNameSpace;

        var getSecurityInfo = function () {

            var deferred = $q.defer();

            if (refreshLocalStorage()) {
                console.log('Authentication process started');
                $http({
                    cache: false,
                    method: 'GET',
                    url: apiUrl,
                    withCredentials: true
                }).success(function (data, status, headers, config) {

                    deferred.resolve(data);

                    createlocalStorage(data);

                    console.log('Authentication process ended');

                    //broadcast the end of the authentication process
                    notificationChannel.authEnded();

                }).error(function (data, status, headers, config) {
                    accessDenied('System');

                    deferred.reject(data);
                });
            }
            else {
                //broadcast the end of the authentication process
                //notificationChannel.authEnded();

                deferred.resolve(getlocalStorage());

            }

            return deferred.promise;
        };

        var getLevelTree = function (webFactoryMenuId, menuList) {
            var levelTree = [];
            for (var l0 = 0; l0 < menuList.length; l0++) {
                for (var l1 = 0; l1 < menuList[l0].childs.length; l1++) {
                    for (var l2 = 0; l2 < menuList[l0].childs[l1].childs.length; l2++) {
                        if (menuList[l0].childs[l1].childs[l2].webFactoryMenuId == webFactoryMenuId) {
                            levelTree = menuList[l0].childs[l1].childs[l2].levelTree;
                            return levelTree;
                        }
                    }
                }
            }
        }

        var accessDenied = function (pageTitle) {
            var ErrorTitle = "Access Denied to " + pageTitle;
            toaster.pop('error', ErrorTitle, "You are not authorized to view this page."); //+ response.data.exceptionMessage);
            $rootScope.$evalAsync(function () {
                $location.path('/403');
            });
        };

        var createlocalStorage = function (localStorageSecurityInfo) {
            //we have replace the angular $cookieStore directive by ipCookie in order to set the expiration cookie.
            //ipCookie(cookieName, JSON.stringify(cookieSecurityInfo), { expires: 1 });
            //we have decided to use localstorage instead of cookies because of the cookie size limit
            localStorage.setItem(localStorageName, JSON.stringify(localStorageSecurityInfo))
        }

        var removelocalStorage = function (localStorageSecurityInfo) {
            localStorage.removeItem(localStorageName);
        }

        var getlocalStorage = function () {
            var localStorageValue = JSON.parse(localStorage.getItem(localStorageName));
            ////we have to check if the the cookie was generated with the old cookieStore as this directive 
            //var cookieSecurityInfo = typeof(cookieValue) != 'object' ? JSON.parse(cookieValue) : cookieValue;
            //var localStorageValue = JSON.parse(localStorageValue);
            return localStorageValue;
        }

        var refreshLocalStorage = function () {

            var localStorageSecurityInfo = getlocalStorage(localStorageName);

            if (!localStorageSecurityInfo ||
                !localStorageSecurityInfo.userSecurity) {
                return true;
            }
            else {
                var nowDate = moment();
                var expiryDate = moment(localStorageSecurityInfo.expiryDate, "DD/MM/YYYY");
                if (nowDate >= expiryDate) {
                    return true;
                }
            }


            return false;
        }

        var hasAccess = function (action, route) {
            //return getSecurityInfo().then(function (oSecurityInfo) {
                var hasAccess = false;

                oSecurityInfo = getlocalStorage(); 
                
                //get from server the action that corresponds to the "access" permission.
                if (action == "access" && oSecurityInfo.accessAction) {
                    action = oSecurityInfo.accessAction;
                }
               
                if (oSecurityInfo) {
                    //check if the user has the requested permission equate
                    var permissions = oSecurityInfo.userSecurity.permissions;
                    for (var i = 0; i < permissions.length; i++) {
                        if (permissions[i].action.toLowerCase() == action.toLowerCase() &&
                            permissions[i].route.toLowerCase() == route.toLowerCase() &&
                            permissions[i].appNameSpace == securityConstants.appNameSpace) {
                            hasAccess = true;
                            break;
                        }
                    }
                }

                
                return hasAccess;
            //});

            
        }

        var getPageAccess = function (route) {
            var permissions = securityConstants.permissions;
            var access;
            for (var i = 0; i < permissions.length; i++) {
                var permission = permissions[i];
                if (permission.route == route && permission.access != undefined) { //check the access permission of the selected route
                    access = permission.access;
                    break;
                }
            }
            return access;
        }

        var getAppPermissions = function () {
            var oSecurityInfo = getlocalStorage();
            return oSecurityInfo.appPermissions;
        }

        var authorizeRoute = function (route, title) {
            //getSecurityInfo().then(function (oSecurityInfo) {
            //    if (!hasAccess("access", route) && route != '/403') {
            //        title = title != undefined ? title : 'this route';
            //        accessDenied(title);
            //    }
            //});
            if (!hasAccess("access", route) && route != '/403') {
                title = title != undefined ? title : 'this route';
                accessDenied(title);
            }
        };

        return {
            authorizeRoute: function (route, title) {
                authorizeRoute(route, title);
            },
            hasAccess: function (action, route) {
                return hasAccess(action, route);
            },
            getPageAccess: function (route) {
                var access = getPageAccess(route);
                return access;
            },
            getSecurityInfo: getSecurityInfo,
            getAppPermissions: function () {
                return getAppPermissions();
            },
            getlocalStorage: function () {
                return getlocalStorage();
            },
            reset: function () {
                var tempSecurityInfo = getlocalStorage()
                removelocalStorage();
                getSecurityInfo()
                  .then(function (oSecurityInfo) {
                      toaster.pop('success', "Security", "Permissions updated succesfully."); //+ response.data.exceptionMessage);
                      $location.path('/dasboard');
                  }, function (response) {//error
                      createlocalStorage(tempSecurityInfo);
                  });
            },
            setApiUrl: function (apiUrl) {
                _apiUrl = apiUrl;
            }
            //isAuthenticated: function (user) {
            //    return true;
            //}
        };
    }]);

///#source 1 1 /appNugets/Espa.Angular.IntegratedSecurity/directives/permissionsDirective.js
'use strict';

angular.module('espa.integratedSecurity')
.directive('espaDisplay', ['authService', 'notificationChannel',
    function (authService, notificationChannel) {
        var grantAccess = function (action, route, element, prevDisp) {
            var hasAccess = authService.hasAccess(action, route); 
            if (hasAccess) {
                element.css('display', prevDisp);
            }
            else {
                element.css('display', 'none');
            }
        };
        
        return {
            restrict: 'A',
            scope: {
                action: "@espaDisplayaction",
                route: "@espaDisplayroute"
            },
            link: function (scope, element, attrs) {
                var prevDisp = element.css('display');

                //Hide element by default
                element.hide();

                var action = scope.action;
                var route = scope.route;

                grantAccess(action, route, element, prevDisp);

                //Wait for the end of authentication process.
                var endAuthHandler = function () {
                    grantAccess(action, route, element, prevDisp);
                };

                notificationChannel.onAuthEnded(scope, endAuthHandler);

            }
        };
    }]);

