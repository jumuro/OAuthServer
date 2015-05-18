///#source 1 1 /appNugets/Espa.Angular.NotificationChannel/module.js
angular.module('espa.notificationChannel', []);
///#source 1 1 /appNugets/Espa.Angular.NotificationChannel/services/notificationChannelService.js
angular.module('espa.notificationChannel')
//Service Constants
.constant('notificationChannelConstants', {
    events: {}
})
.factory('notificationChannel', ['$rootScope',
    function ($rootScope) {
    
    return {
        
    };
}]);
