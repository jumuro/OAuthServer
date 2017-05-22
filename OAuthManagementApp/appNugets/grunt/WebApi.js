

module.exports = function (grunt) {

    //create replace target for each environment
    var createConfig = function (environment) {
        var target = 'WebApi' + environment;
        grunt.config(['replace', target], {
            options: {
                patterns: [{
                    json: grunt.file.readJSON('./appNugets/Jumuro.Angular.WebApi/environments/' + environment + '.json')
                }],
            },
            files: [{
                flatten: true,
                src: ['./appNugets/Jumuro.Angular.WebApi/Constants/gruntReplaceSource.js'],
                dest: './appNugets/Jumuro.Angular.WebApi/Constants/appConfigConstants.js'
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
        var path = require('path');
        var projectPath = path.resolve('gruntfile.js');
        if (!projectPath) {
            throw new Error('Unable to determine the absolute project path')
        }

        var target = tfs + '_WebApi'

        var command = '"C:\\Program Files (x86)\\Microsoft Visual Studio 12.0\\Common7\\IDE\\tf.exe" ' + tfs + ' ' +
                      config.project.tfsWorkSpace + 'appnugets\\jumuro.angular.WebApi\\constants\\appConfigConstants.js';

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