var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var apidoc = require('gulp-apidoc');
var config = require('./config.js');

gulp.task('default', ['docs'], function () {
    nodemon({
        script: 'bin/www',
        ext: 'js hbs',
        env: {
            'NODE_ENV': 'development',
            'PORT': '1999'
        },
        nodeArgs: ['--debug'],
        ignore: ['/public', '/apidocs'],
        //tasks: ['docs']
    });

    gulp.watch('./api/**/*.js', ['docs']);
});

gulp.task('docs', function (done) {
    apidoc({
        src: './api/',
        dest: './apidocs/'
    }, done);
});