
module.exports = function (grunt) {
    grunt.registerTask('appConfig_' + global.devEnvironment, global[global.devEnvironment].appConfigTaskList);
    grunt.registerTask('appConfig_' + global.testEnvironment, global[global.testEnvironment].appConfigTaskList);
    grunt.registerTask('appConfig_' + global.liveEnvironment, global[global.liveEnvironment].appConfigTaskList);
}