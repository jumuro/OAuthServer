
module.exports = function (grunt) {
    grunt.registerTask('tfsCheckOut', global.config.checkoutTaskList);
    grunt.registerTask('tfsUndo', global.config.undoTaskList);
}
