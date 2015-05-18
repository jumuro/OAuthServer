
module.exports = {
    dev: {
        options: {
            patterns: [{
                json: '<%=replace_json_dev%>'
            }]
        },
        files: [{
            flatten: true,
            src: ['<%=replace_src_dev%>'],
            dest: '<%=replace_dest_dev%>'
        }]
    },
    test: {
        options: {
            patterns: [{
                json: '<%=replace_json_test%>'
            }]
        },
        files: [{
            flatten: true,
            src: ['<%=replace_src_test%>'],
            dest: '<%=replace_dest_test%>'
        }]
    },
    live: {
        options: {
            patterns: [{
                json: '<%=replace_json_live%>'
            }]
        },
        files: [{
            flatten: true,
            src: ['<%=replace_src_live%>'],
            dest: '<%=replace_dest_live%>'
        }]
    }
}