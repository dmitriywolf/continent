"use strict";
const gulp = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const autoPrefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');

const dist = './dist';

//Copy HTML
function html() {
  return gulp.src('./src/*.html')
      .pipe(gulp.dest(dist))
      .pipe(browserSync.reload({stream: true}))
}

//Styles
function style() {
  return gulp.src('./src/sass/style.scss')
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoPrefixer({
        overrideBrowserList: ['last 2 versions'],
        cascade: false
      }))
      .pipe(cleanCSS({level: 2}))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(dist + '/css'))
      .pipe(browserSync.reload({stream: true}))
}

//JS
function scripts() {
  return gulp.src('./src/js/main.js')
      .pipe(webpack({
        mode: 'production',
        output: {
          filename: 'index.js'
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /(node_modules)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [['@babel/preset-env', {
                    debug: true,
                    corejs: 3,
                    useBuiltIns: 'usage'
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

//Images
function img() {
  return gulp.src("./src/img/**/*.*")
      .pipe(gulp.dest(dist + '/img'))
}

// Fonts
function fonts() {
  return gulp.src('./src/fonts/**/*.*')
      .pipe(gulp.dest(dist + '/fonts'))
}

// Clean
function clean() {
  return del([dist])
}

// Watch
function watch() {
  browserSync.init({
    server: {
      baseDir: dist
    }
  });
  gulp.watch('./src/*.html', html);
  gulp.watch('./src/sass/**/*.scss', style);
  gulp.watch('./src/js/*.js', scripts);
}

gulp.task('build', gulp.series(clean, gulp.parallel(html, style, scripts, img, fonts)));

gulp.task('default', gulp.series('build', watch));