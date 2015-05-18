/// <vs />

module.exports = function (grunt) {

    //#region private global variables

    //ENVIRONMENTS
    global["devEnvironment"] = 'dev';
    global["testEnvironment"] = 'test';
    global["liveEnvironment"] = 'live';


    //appConfigTaskList
    global["dev"] = {};
    global.dev["appConfigTaskList"] = [];

    global["test"] = {};
    global.test["appConfigTaskList"] = [];

    global["live"] = {};
    global.live["appConfigTaskList"] = [];

    //checkoutTaskList
    global["config"] = {};
    global.config["checkoutTaskList"] = [];
    //undoTaskList
    global.config["undoTaskList"] = [];



    //#endregion private variables



    // load grunt tasks
    require('load-grunt-tasks')(grunt);

    // load grunt config
    require('load-grunt-config')(grunt);

    //load nuget grunt tasks
    grunt.loadTasks('appnugets/grunt');

    //laad project tasks
    grunt.loadTasks('grunt/tasks');

}