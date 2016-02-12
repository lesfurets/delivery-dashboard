module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "styles/css/main.css": "styles/less/main.less"
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9', '> 1%']
            },
            main: {
                src: 'styles/css/*.css'
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['app/api/**/*.js','app/dashboard/**/*.js','app/core/**/*.js'],
                dest: 'app/base.js'
            },
        },
        watch: {
            less: {
                files: ['styles/less/**/*.less'],
                tasks: ['styles'],
            },
            css: {
                files: ['styles/css/main.css'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['app/api/**/*.js','app/dashboard/**/*.js','app/core/**/*.js'],
                tasks: ['app'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['html/**/*.html'],
                options: {
                    livereload: true
                }
            },
        }
    });

    grunt.registerTask('styles', ['less', 'autoprefixer']);
    grunt.registerTask('app', ['concat']);
    grunt.registerTask('w', ['less', 'autoprefixer', 'watch']);
    grunt.registerTask('default', ['styles', 'app']);
};