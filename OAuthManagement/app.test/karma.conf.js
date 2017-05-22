module.exports = function (config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',

        // frameworks to use
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            '../scripts/angular.js',
            '../scripts/angular-mocks.js',
            '../scripts/angular-route.js',
            '../scripts/angular-animate.js',
            '../scripts/toaster.js',
            '../scripts/angular-cookies.js',
            '../scripts/angular-mocks.js',
            '../scripts/angular-ui/ui-bootstrap-tpls.js',
            '../scripts/Toaster.js',
            '../scripts/extra/angular-cache-2.3.7.js',
            '../scripts/extra/ng-bs-daterangepicker.js',
            '../scripts/extra/angular-multi-select.js',
            '../scripts/extra/moment.js',
            '../scripts/extra/moment-range.js',
            '../app/*.js',
            '../app/**/*.js',
            '../app.test/Unit/**/*.js',
            '../app.test/Unit/*.js',
        ],

        // list of files to exclude
        exclude: [
        ],

        // test results reporter to use
        reporters: ['progress'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers
        browsers: ['Chrome', 'Firefox', 'IE'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};