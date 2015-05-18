
module.exports = function (grunt) {

    //create replace target for each environment
    var createConfig = function (environment) {
        var target = 'WebApi' + environment;
        grunt.config(['replace', target], {
            options: {
                patterns: [{
                    json: grunt.file.readJSON('./appNugets/Espa.Angular.WebApi/environments/' + environment + '.json')
                }],
            },
            files: [{
                flatten: true,
                src: ['./appNugets/Espa.Angular.WebApi/Constants/gruntReplaceSource.js'],
                dest: './appNugets/Espa.Angular.WebApi/Constants/appConfigConstants.js'
            }]
        });

        global[environment].appConfigTaskList.push('replace:' + target);
    }

    //create the tfs exec command 
    var createTfsTask = function (tfs) {

        var readConfJSON = './grunt/config/config.json';

        //read grunt config json file
        var config = grunt.file.readJSON(readConfJSON);

        //check if the developer has configured the grunt config file
        if (!config.project.tfsWorkSpace) {
            throw new Error('You forgot to set the tfsWorkSpace property within the config file (' + readConfJSON + ')')
        }
        //check if the developer has configured the grunt config file
        if (!config.project.absoluteProjectPath) {
            throw new Error('You forgot to set the absoluteProjectPath property within the config file (' + readConfJSON + ')')
        }

        var target = tfs + '_WebApi'

        var command = 'cd ' + config.project.absoluteProjectPath + '&' +
                      '"C:\\Program Files (x86)\\Microsoft Visual Studio 12.0\\Common7\\IDE\\tf.exe" ' + tfs + ' ' +
                      config.project.tfsWorkSpace + 'appnugets\\espa.angular.WebApi\\constants\\appConfigConstants.js';

        grunt.config(['exec', target], {
            cmd: command
        });

        global.config[tfs + "TaskList"].push('exec:' + target);
    }

    createConfig(global.devEnvironment);
    createConfig(global.testEnvironment);
    createConfig(global.liveEnvironment);

    createTfsTask('checkout');
    createTfsTask('undo');
}