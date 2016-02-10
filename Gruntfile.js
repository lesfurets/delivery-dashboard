module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-less");

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
    watch: {
      styles: {
        files: ['styles/less/**/*.less'],
        tasks: ['default'],
        options: {
          livereload: true,
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask('default', ['less', 'autoprefixer']);
  grunt.registerTask('w', ['less', 'autoprefixer', 'watch']);
};