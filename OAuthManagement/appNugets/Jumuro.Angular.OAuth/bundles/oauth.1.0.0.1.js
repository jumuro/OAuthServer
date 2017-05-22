///#source 1 1 /appNugets/Jumuro.Angular.OAuth/module.js
angular
    .module('jumuro.oAuth', ['ipCookie', 'toaster'])
    .run(oAuthRun);

oAuthRun.$inject = ['$rootScope', 'oAuthService', '$location', 'toaster'];

function oAuthRun($rootScope, oAuthService, $location, toaster) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (!oAuthService.isAuthenticated()) {
            if ($location.path() !== '/login') {
                toaster.pop('error', 'Access Denied', 'Access denied. Plese enter your user and password.')
            }

            $location.path('/login');
        }
    });
}

angular
    .module('jumuro.oAuth')
    .config(config);

config.$inject = ['$routeProvider', '$httpProvider', 'oAuthConstants'];

function config($routeProvider, $httpProvider, oAuthConstants) {
    $httpProvider.interceptors.push('oAuthHttpInterceptor');
    // Set appPathName deleting page file name if it exists in current window.location.pathname
    oAuthConstants.appPathName = window.location.pathname.substr(0, window.location.pathname.lastIndexOf("/") + 1);
    oAuthConstants.oAuthCookieName = ('AppInfo_' + window.location.host + oAuthConstants.appPathName).replace(/[:\/]/g, '_');
}
///#source 1 1 /appNugets/Jumuro.Angular.OAuth/constants/oAuthConstants.js
'use strict';

angular
    .module('jumuro.oAuth')
    .constant('oAuthConstants', {
        oAuthCookieName: '',
        appPathName: ''
    });
///#source 1 1 /appNugets/Jumuro.Angular.OAuth/services/oAuthHttpInterceptor.js
'use strict';

angular
    .module('jumuro.oAuth')
    .factory('oAuthHttpInterceptor', oAuthHttpInterceptor);

oAuthHttpInterceptor.$inject = ['$q', '$injector', 'ipCookie', 'oAuthConstants', 'toaster', '$location'];

function oAuthHttpInterceptor($q, $injector, ipCookie, oAuthConstants, toaster, $location) {
    var service = {
        request: request,
        responseError: responseError
    };

    return service;

    function request(config) {
        if ($location.path() !== '/login') {
            config.headers = config.headers || {};

            //get the cookie
            var authData = ipCookie(oAuthConstants.oAuthCookieName);

            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.access_token;
            }
            else {
                var authService = $injector.get('oAuthService');
                authService.logOut();
            }
        }

        return config;
    }

    function responseError(rejection) {
        if (rejection.status === 400) {
            if (rejection.data && rejection.data.message) {
                toaster.pop('error', "Error", rejection.data.message);
            }
            else if (rejection.data && rejection.data.error) {
                if (rejection.data.error === 'invalid_grant') {
                    toaster.pop('error', "Error", rejection.data.error_description);
                }
            }
        }
        else if (rejection.status === 401) {
            var authService = $injector.get('oAuthService');
            var authData = ipCookie(oAuthConstants.oAuthCookieName);
            var $http = $http || $injector.get('$http');
            var deferred = $q.defer();

            if (authData) {
                authService.refreshToken().then(function () {
                    //this repeats the request with the original parameters
                    return deferred.resolve($http(rejection.config));
                });
            }
            return deferred.promise;
        }
        else if (rejection.status === 403) {
            var toaster = $injector.get('toaster');
            toaster.pop('error', "Access Denied", "You are not authorized to do this request.");

            //window.location.path = oAuthConstants.appPathName;
        }
        else if (rejection.status === 0 || rejection.status === 500) {
            if (rejection.data && rejection.data.message) {
                toaster.pop('error', "Error", rejection.data.message);
            } else {
                toaster.pop('error', "Error", rejection.data);
            }
        }
        else {
            return $q.reject(rejection);
        }
    }
}
///#source 1 1 /appNugets/Jumuro.Angular.OAuth/services/oAuthService.js
'use strict';

angular
    .module('jumuro.oAuth')
    .service('oAuthService', oAuthService);

oAuthService.$inject = ['$http', '$q', '$injector', 'ipCookie', 'oAuthConstants', 'oAuthAppConfigConstants', '$location'];

function oAuthService($http, $q, $injector, ipCookie, oAuthConstants, oAuthAppConfigConstants, $location) {
    //    var toaster = $injector.get('toaster');

    var service = {
        refreshToken: refreshToken,
        logOut: logOut,
        logIn: logIn,
        hasCookie: hasCookie,
        getUserInfo: getUserInfo,
        isAuthenticated: isAuthenticated
    };

    return service;

    function refreshToken() {
        var deferred = $q.defer();

        //get the cookie
        var authData = ipCookie(oAuthConstants.oAuthCookieName);

        if (authData) {
            var data = "grant_type=refresh_token&refresh_token=" + authData.refresh_token + "&client_id=" + authData.client_id;

            $http
                .post(oAuthAppConfigConstants.appConfig.oAuthURL, data, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (response) {
                    ipCookie(oAuthConstants.oAuthCookieName, response, { path: oAuthConstants.appPathName });
                    deferred.resolve(response);
                })
                .error(function (err, status) {
                    logOut();
                    deferred.reject(err);
                });
        }

        return deferred.promise;
    };

    function logIn(postData) {
        var deferred = $q.defer();

        var data = "grant_type=password&username=" + postData.username + "&password=" + postData.password + "&client_id=" + oAuthAppConfigConstants.appConfig.oAuthClientId;

        $http
            .post(oAuthAppConfigConstants.appConfig.oAuthURL, data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            .success(function (data, status, headers, config) {
                // Create cookie. TODO: we have to return user info
                ipCookie(oAuthConstants.oAuthCookieName, data, { path: oAuthConstants.appPathName });
                //Provisionally store user in a local storage until we return the user info from the oAuth api.
                localStorage.setItem("login-info", JSON.stringify({ username: postData.username }));

                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {
                deferred.reject(data);
            });

        return deferred.promise;
    };

    function getUserInfo() {
        var userInfo = JSON.parse(localStorage.getItem("login-info"));

        return userInfo;
    }

    function hasCookie() {
        return ipCookie(oAuthConstants.oAuthCookieName);
    }

    function logOut() {
        // Delete current cookie if it already exsits
        ipCookie.remove(oAuthConstants.oAuthCookieName, { path: oAuthConstants.appPathName });

        localStorage.removeItem("login-info");

        $location.path('/login');
    };

    function isAuthenticated() {
        var ok = ipCookie(oAuthConstants.oAuthCookieName);
        //TODO: We may check some sort of route property like anonymous for static content routes.
        return ok;
    };
}

