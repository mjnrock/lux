module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            files: {
                src: "src/node/*.js",
                dest: "public/",
                expand: true,
                flatten: true,
                ext: ".min.js"
            }
        },
        min: {
            js: {
                src: "public/lux.js",
                src: "public/lux.min.js",
            }
        },
        concat: {
            js: {
              src: "public/*.min.js",
              dest: "public/lux.js"
            }
        },
        watch: {
            js: { files: "src/node/*.js", tasks: [ "uglify" ] },
        }
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify-es");

    grunt.registerTask("default", [ "concat", "uglify" ]);
};