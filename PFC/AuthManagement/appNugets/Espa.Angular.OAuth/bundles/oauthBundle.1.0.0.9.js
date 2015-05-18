///#source 1 1 /appNugets/Espa.Angular.OAuth/module.js
angular
    .module('espa.publicOAuth', ['espa.notificationChannel', 'ipCookie', 'toaster', 'espa.webapi'])
    .config(config);

config.$inject = ['$routeProvider', '$httpProvider', 'oAuthConstants'];

function config($routeProvider, $httpProvider, oAuthConstants) {
    $httpProvider.interceptors.push('oAuthHttpInterceptor');
    // Set appPathName deleting page file name if it exists in current window.location.pathname
    oAuthConstants.appPathName = window.location.pathname.substr(0, window.location.pathname.lastIndexOf("/") + 1);
    oAuthConstants.oAuthCookieName = ('AppInfo_' + window.location.host + oAuthConstants.appPathName).replace(/[:\/]/g, '_');
}
///#source 1 1 /appNugets/Espa.Angular.OAuth/constants/oAuthConstants.js
'use strict';

angular
    .module('espa.publicOAuth')
    .constant('oAuthConstants', {
        oAuthCookieName: '',
        appPathName: ''
    });
///#source 1 1 /appNugets/Espa.Angular.OAuth/services/oAuthHttpInterceptor.js
'use strict';

angular
    .module('espa.publicOAuth')
    .factory('oAuthHttpInterceptor', oAuthHttpInterceptor);

oAuthHttpInterceptor.$inject = ['$q', '$injector', 'ipCookie', 'oAuthConstants', 'webapiAppConfigConstants'];

function oAuthHttpInterceptor($q, $injector, ipCookie, oAuthConstants, webapiAppConfigConstants) {
    var authInterceptorServiceFactory = {};

    var _request = function (config) {
        if (config.url.indexOf(webapiAppConfigConstants.appConfig.ApiURL) >= 0) { 
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
    };

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
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
        else {
            return $q.reject(rejection);
        }
    };

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}
///#source 1 1 /appNugets/Espa.Angular.OAuth/services/oAuthService.js
'use strict';

angular
    .module('espa.publicOAuth')
    .service('oAuthService', oAuthService);

oAuthService.$inject = ['$http', '$q', '$injector', 'ipCookie', 'oAuthConstants', 'webapiAppConfigConstants'];

function oAuthService($http, $q, $injector, ipCookie, oAuthConstants, webapiAppConfigConstants) {
    var refreshToken = function () {

        var oAuthURL = webapiAppConfigConstants.appConfig.OAuthURL;

        var deferred = $q.defer();

        //get the cookie
        var authData = ipCookie(oAuthConstants.oAuthCookieName);

        if (authData) {
            var data = "grant_type=refresh_token&refresh_token=" + authData.refresh_token + "&client_id=" + authData.client_id;

            $http.post(oAuthURL, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                //ipCookie.remove(oAuthConstants.oAuthCookieName);
                ipCookie(oAuthConstants.oAuthCookieName, response, { path: oAuthConstants.appPathName });
                deferred.resolve(response);

            }).error(function (err, status) {
                logOut();
                deferred.reject(err);
            });
        }

        return deferred.promise;
    };

    var logOut = function () {
        // Delete current cookie if it already exsits
        ipCookie.remove(oAuthConstants.oAuthCookieName, { path: oAuthConstants.appPathName });

        // Ahora mismo no se va a ver el toaster ya que al cambiar href se va a servidor.
        // Estudiar el ciclo de vida de la aplicación para que se haga todo en cliente

        var toaster = $injector.get('toaster');
        toaster.pop('error', "Cookie error", "Authorization info not found. Trying to authorize again...");

        window.location.href = oAuthConstants.appPathName;
    };

    return {
        refreshToken: function () {
            return refreshToken();
        },
        logOut: function () {
            return logOut();
        }
    };
}

