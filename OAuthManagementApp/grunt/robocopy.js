
module.exports = {
    test: {
        options: {
            source: '../AuthManagement',
            destination: '<%=robocopy_destination_test%>',
            files: ['*.config', '*.html', '*.htm', '*.js', '*.eot', '*.svg', '*.ttf', '*.woff', '*.otf',
                    '*.png', '*.jpg', '*.jpeg', '*.gif', '*.css', '*.json'],
            copy: {
                mirror: true,
                info: 'DAT',
                removeAttributes: 'R'
            },
            file: {
                excludeFiles: ['packages.config', 'karma.conf.js'],
                excludeDirs: ['app.test', 'node_modules', 'nuspec'],
            },
            retry: {
                count: 2,
                wait: 3
            },
        }
    },
    live: {
        options: {
            source: '../AuthManagement',
            destination: '<%=robocopy_destination_live%>',
            files: ['*.config', '*.html', '*.htm', '*.js', '*.dll', '*.eot', '*.svg', '*.ttf', '*.woff', '*.otf',
                    '*.png', '*.jpg', '*.jpeg', '*.gif', '*.css', '*.json'],
            copy: {
                mirror: true,
                info: 'DAT',
                removeAttributes: 'R'
            },
            file: {
                excludeFiles: ['packages.config', 'karma.conf.js'],
                excludeDirs: ['app.test', 'node_modules', 'nuspec'],
            },
            retry: {
                count: 2,
                wait: 3
            },
        }
    }
}