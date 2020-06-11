"use strict";

let gulp = require('gulp');
let sass = require('gulp-sass');
sass.compiler = require('node-sass');
let autoprefixer = require('gulp-autoprefixer');
let concat = require('gulp-concat');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify');
let cleanCss = require('gulp-clean-css');
let browserSync = require('browser-sync').create();
let del = require('del');

/*----------------------------------------------Разработка-----------------------------------*/
//Static Server
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: "./src/"
        }
    });
});

// Отслеживание HTML
gulp.task('html', function () {
    return gulp.src('./src/*.html')
        .pipe(browserSync.reload({stream: true}))
});

//Style SASS --> CSS
gulp.task('style', function () {
    return gulp.src('./src/sass/style.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./src/css'))
        .pipe(browserSync.reload({stream: true}))
});

// Отслеживание изменений в JS
gulp.task('script', function () {
    return gulp.src('./src/js/*.js')
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('watch', function () {
    gulp.watch('./src/sass/**/*.scss', gulp.parallel('style'));
    gulp.watch('./src/*.html', gulp.parallel('html'));
    gulp.watch('./src/js/*.js', gulp.parallel('script'));
});


/*-----------------------------------------------Сборка--------------------------------------*/

//Сборка HTML
function layoutHTML() {
    return (gulp.src('./src/*.html'))
        .pipe(gulp.dest('./dist/'))
}

//Сборка CSS
//Порядок подключения CSS файлов
const cssFiles = [];

function cssBuild() {
    return gulp.src('./src/css/*.css')
    //Объединение файлов в один
        .pipe(concat('style.css'))
        //Минификация CSS
        .pipe(cleanCss({
            level: 2
        }))
        //Выходная папка для стилей
        .pipe(gulp.dest('./dist/css'))
}

//Сборка JS
//Порядок подключения js файлов
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
];

function jsBuild() {
    return gulp.src(jsFiles)
    //Объединение файлов в один
        .pipe(concat('script.js'))
        //Минификация JS
        .pipe(uglify({
            toplevel: true
        }))
        //Выходная папка для скриптов
        .pipe(gulp.dest('./dist/js'))
}

//Удалить всё в указанной папке
function clean() {
    return del(['./dist/*'])
}


//Для разработки
gulp.task('default', gulp.parallel('style', 'browser-sync', 'watch'));

//Таск сборки
gulp.task('build', gulp.series(clean, gulp.parallel(cssBuild, jsBuild)));