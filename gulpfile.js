var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    compass = require('gulp-compass'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    del = require('del'),
    rename = require('gulp-rename');

//Script Task
gulp.task('scripts', function () {
    gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));
});

//compass sass task
gulp.task('compass', function () {
    gulp.src('app/scss/style.scss')
        .pipe(plumber())
        .pipe(compass({
            config_file: './config.rb',
            css: 'app/css',
            sass: 'app/scss',
            require: 'susy'
        }))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('app/css/'))
        .pipe(reload({stream: true}));
});

//html
gulp.task('html', function () {
    gulp.src('app/**/*.html');
});

//Build Task

// task to run build server for testing final app
gulp.task('build:serve', function() {
    browserSync({
        server: {
            baseDir: "./build/"
        }
    });
});
//clear all output files
gulp.task('build:cleanfolder', function () {
    del([
        'build/**'
    ])
});

//create build directory
gulp.task('build:copy', ['build:cleanfolder'], function () {
    return gulp.src('app/**/*/')
        .pipe(gulp.dest('build/'));
});

// task to removed unwanted build files
// list all files and directories here that you don't want included
gulp.task('build:remove', ['build:copy'], function (cb) {
    del([
        'build/scss',
        'build/js/!(*.min.js)',
    ],cb);
});

gulp.task('build', ['build:copy', 'build:remove']);

//watch task
gulp.task('watch', function () {
    gulp.watch('app/js/**/*.js', ['scripts']);
    gulp.watch('app/scss/**/*.scss', ['compass']);
    gulp.watch('app/**/*.html', ['html']);
})

//Default Task
gulp.task('default', ['scripts', 'compass', 'html', 'browser-sync', 'watch']);
