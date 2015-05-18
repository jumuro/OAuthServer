exports.config = {
    allScriptsTimeout: 11000,

    specs: [
      'E2E/*.js'
    ],

    capabilities: {
        'browserName': 'chrome'
    },

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    },

    seleniumAddress: 'http://localhost:4444/wd/hub',

    onPrepare: function () {
        protractor.helperFuntion = require('./helpers/helperFunctions.js');
    }
};