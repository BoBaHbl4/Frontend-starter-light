var gulp = require('gulp');
var browserSync = require("browser-sync");
var reload      = browserSync.reload;
var less = require("gulp-less");
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var es = require('event-stream');
var inject = require('gulp-inject');
var concat = require('gulp-concat');
var print = require('gulp-print');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sourcemaps = require('gulp-sourcemaps');
var path = require('path');
var util = require('gulp-util');
var merge = require('merge-stream');
var del = require('del');

// Static Server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./build/"
        },
        startPath: "/views/"
    });
});

gulp.task('updateView', function() {
    gulp.src(['./build/views/*.*', './build/css/*.css'])
        .pipe(reload({stream:true}));
});

gulp.task('updateScript', ['updateView', 'js-dev-inject'], function() {
    gulp.src('./dev_root/js/**/*.*')
        .pipe(reload({stream:true}));
});

// Styles tasks

// -----------------------------------
// List of tasks to start dev process
// -----------------------------------
// Move lib less sources to dev folder
gulp.task('bootstrap-less-move', function () {
    return gulp.src([
            './bower_components/bootstrap/less/**/*.*',
            './bower_components/bootstrap/less/*.*'

        ])
        .pipe(gulp.dest('./dev_root/css/less/bootstrap/'));
});
gulp.task('font-awesome-less-move', function () {
    return gulp.src([
            './bower_components/font-awesome/less/*.*'

        ])
        .pipe(gulp.dest('./dev_root/css/less/font-awesome/'));
});
// -----------------------
// /End of starting tasks
// -----------------------

// Compile libs *.less-files to css
// Concat and minify styles
gulp.task('lib-less', function () {
    return gulp.src([
            './dev_root/css/less/bootstrap/bootstrap.less',
            './dev_root/css/less/font-awesome/font-awesome.less'
        ])
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(concat('lib-styles.min.css'))
        .pipe(gulp.dest('./dev_root/css'));
});

// Compile dev *.less-files to css
// Concat and minify styles
gulp.task('less-task', function () {
    return gulp.src('./dev_root/css/*.less')
        .pipe(less())
        .pipe(concat('main.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dev_root/css'));
});

// Concat and injecting dev-css-files in build dir
gulp.task('css-inject', ['less-task'], function () {
    var target = gulp.src('./build/views/*.html');
    var customCssStream = gulp.src([
        './dev_root/css/lib-styles.min.css',
        './dev_root/css/main.min.css'
    ]);

    return target
        .pipe(inject(
            customCssStream.pipe(print())
                .pipe(concat('common.min.css'))
                .pipe(gulp.dest('build/css')), { read: false, addRootSlash: false, relative: true })
        )
        .pipe(gulp.dest('./build/views/'))
        .pipe(reload({stream:true}));
});

// Compiling js-dev js and injecting in build dir
gulp.task('js-dev-inject', function () {
    var target = gulp.src('./build/views/index.html');

    var devJsStream = gulp.src([
            './dev_root/js/app.js',
            './dev_root/js/*.js',
            './dev_root/js/**/*.js',
            '!./dev_root/js/libs/*.js'])
        .pipe(print())
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('build/js/'));

    return target
        .pipe(
            inject(
                devJsStream,
                {name: 'dev', read: false, addRootSlash: false, relative: true}))
        .pipe(gulp.dest('./build/views/'));
});

// Injecting js-vendor-libs in build dir
gulp.task('js-vendor-inject', function () {
    var target = gulp.src('./build/views/index.html');
    var vendorJsStream = gulp.src([
            './bower_components/jquery/dist/jquery.min.js',
            './bower_components/bootstrap/dist/js/bootstrap.min.js'])
        .pipe(print())
        .pipe(gulp.dest('build/js/libs'));

    return target
        .pipe(
            inject(
                vendorJsStream,
                {name: 'vendor', read: false, addRootSlash: false, relative: true}))
        .pipe(gulp.dest('./build/views/'));
});

// Starting Project Gulp Task
// Adding proper src-files in dev folders for future development
gulp.task('start-project', [
    'bootstrap-less-move',
    'font-awesome-less-move'], function() {
    console.log('Gulp Project Activated!');
});

// Default Gulp Task
// Included libs, dev styles compile&inject and reload browsers on changes
gulp.task('default', [  'browser-sync',
    'lib-less',
    'less-task',
    'css-inject',
    'js-vendor-inject',
    'js-dev-inject'], function() {
    console.log('Gulp started!');

    var buildUpdate = ['lib-less', 'less-task', 'css-inject', 'updateView'];

    gulp.watch('./dev_root/css/*.less',buildUpdate);
    gulp.watch('./dev_root/css/less/*.less',buildUpdate);
    gulp.watch('./build/views/*.*',['updateView']);
    gulp.watch('./dev_root/js/**/*.js',['updateScript']);

});
