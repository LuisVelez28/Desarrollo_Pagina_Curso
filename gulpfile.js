'use strict'

var gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    browserSync = require('browser-sync'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

gulp.task('sass', function () {
    return gulp.src('./css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./css/*.scss', gulp.series('sass'));
});

gulp.task('browser-sync', function () {
    var files = ['./html', './css/*.css', './images/*.{png,jpg,gif,jpeg}', './js/*.js']
    browserSync.init(files, {
        server: {
            baseDir: './'
        }
    });
});

gulp.task('default', gulp.parallel('browser-sync', 'sass:watch'));

gulp.task('clean', function () {
    return import('del').then(function (module) {
        return module.deleteAsync(['dist']);
    });
});

gulp.task('copyfonts', function () {
    return gulp.src('./node_modules/open-iconic/font/fonts/*.*{ttf,woff,eof,svg}')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('imagemin', function () {
    return import('gulp-imagemin').then(function (module) {
        var imagemin = module.default;
        return gulp.src('./images/*.{png,jpg,gif,jpeg}')
            .pipe(imagemin({
                optimizationLevel: 3,
                progressive: true,
                interlaced: true
            }))
            .pipe(gulp.dest('dist/images'));
    });
});

gulp.task('usemin', function () {
    return import('gulp-rev').then(function (module) {
        var rev = module.default;
        return gulp.src('./*.html')
            .pipe(flatmap(function (stream, file) {
                return stream
                    .pipe(usemin({
                        css: [rev()],
                        html: [function () { return htmlmin({ collapseWhitespace: true }) }],
                        js: [uglify(), rev()],
                        inlinejs: [uglify()],
                        inlinecss: [cleanCss(), 'concat']
                    }));
            }))
            .pipe(gulp.dest('dist/'));
    });
});

gulp.task('build', gulp.series('clean', 'copyfonts', 'imagemin', 'usemin'));