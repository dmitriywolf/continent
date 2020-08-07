"use strict";
let gulp = require('gulp');
let sass = require('gulp-sass'); //Компилятор SCSS --> CSS
sass.compiler = require('node-sass');
let autoPrefix = require('gulp-autoprefixer'); //Расстановка префиксов
let cleanCSS = require('gulp-clean-css'); //Минификация CSS
let uglify = require('gulp-uglify'); //Обычная минификация JS
let rename = require('gulp-rename'); //Перетменовае файлов
let del = require('del'); //Очистка
let browserSync = require('browser-sync').create(); //Локальный сервер
const webpack = require("webpack-stream"); //Сборка модулей

/*==================================================================================*/
const dist = "./dist";

//Html
function layoutHTML() {
  return (gulp.src('./src/*.html'))
      .pipe(gulp.dest('./dist/'))
      .pipe(browserSync.reload({stream: true}))
}

//Styles
function style() {
  return gulp.src('./src/sass/style.scss')
  //Компиляция SCSS to CSS
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      //Растановка префиксов
      .pipe(autoPrefix({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false
      }))
      //Минификация
      .pipe(cleanCSS({
        level: 2
      }))
      //Переименование
      .pipe(rename({suffix: '.min'}))
      //Папка назначения
      .pipe(gulp.dest('./dist/css'))
      .pipe(browserSync.reload({stream: true}))
}

//JavaScript
// Webpack Development
function buildJS() {
  return gulp.src("./src/js/main.js")
      .pipe(webpack({
        mode: 'development',
        output: {
          filename: 'index.js'
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [['@babel/preset-env', {
                    debug: true,
                    corejs: 3,
                    useBuiltIns: "usage"
                  }]]
                }
              }
            }
          ]
        }
      }))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(dist + '/js'))
      .pipe(browserSync.reload({stream: true}))
}

// Webpack Production
gulp.task("build-prod-js", () => {
  return gulp.src("./src/js/main.js")
      .pipe(webpack({
        mode: 'production',
        output: {
          filename: 'index.js'
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [['@babel/preset-env', {
                    corejs: 3,
                    useBuiltIns: "usage"
                  }]]
                }
              }
            }
          ]
        }
      }))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(dist + '/js'))
      .pipe(browserSync.reload({stream: true}))
});

//Просматривать файлы
function watch() {
  browserSync.init({
    server: {
      baseDir: dist
    }
  });
  gulp.watch('./src/*.html', layoutHTML);
  gulp.watch('./src/sass/**/*.scss', style);
  gulp.watch('./src/js/*.js', buildJS);
}

//Копирование изображений и шрифтов из src
function copyImg() {
  return gulp.src("./src/img/**/*.*")
      .pipe(gulp.dest('./dist/img/'))
}

function copyFonts() {
  return gulp.src("./src/fonts/**/*.*")
      .pipe(gulp.dest('./dist/fonts/'))
}

//Очитка папки dist
function clean() {
  return del(['./dist/*'])
}

//Таск для удаления файлов в папке dist и запуск сборки
gulp.task('build', gulp.series(clean, gulp.parallel(layoutHTML, style, buildJS, copyImg, copyFonts)));

//Таск запускает таск build и watch последовательно
gulp.task('default', gulp.series('build', watch));



