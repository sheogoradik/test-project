'use strict';

// path for embedding in url (gulp-replace)
let basePath = '/base/path';

const gulp = require('gulp');
const del = require('del');
const extender = require('gulp-html-extend');
const htmlhint = require('gulp-htmlhint');
const sourcemaps = require('gulp-sourcemaps');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const mqpacker = require('css-mqpacker');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const browserSync = require('browser-sync').create();

gulp.task('del', () => {
  return del([
    './build/**/*',
    '!./build/readme.md'
  ])
});

gulp.task('markup', (cb) => {
  gulp.src([
    './src/html/*.html',
    '!./src/html/parts/**/*'
  ])
  .pipe(extender({
    annotations: false,
    verbose: false
  }))
  .pipe(htmlhint('.htmlhintrc'))
  .pipe(htmlhint.reporter())
  .pipe(htmlhint.failAfterError())
  .pipe(gulp.dest('./build/html'));
  cb();
});

gulp.task('styles', () => {
  return gulp.src(['./src/less/*.less'])
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(postcss([
      mqpacker({
        sort: true
      })
    ]))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});

gulp.task('replace-url', (cb) => {
  gulp.src([
    './build/css/critical.css',
    './build/css/critical.min.css'
  ])
    .pipe(replace('../../fonts/', `${basePath}/fonts/`))
    .pipe(replace('../../img/', `${basePath}/img/`))
    .pipe(gulp.dest(['./build/css/']));
    cb();
});

gulp.task('styles-min', () => {
  return gulp.src([
    './build/css/**/*.css',
    '!./build/css/**/*.min.css'
  ])
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build/css'))
});

gulp.task('scripts', () => {
  return gulp.src(['./src/js/**/*.js'])
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream());
});

gulp.task('scripts-min', () => {
  return gulp.src([
    './build/js/**/*.js',
    '!./build/js/**/*.min.js'
  ])
    .pipe(uglify({
      toplevel: true
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build/js'))
});

gulp.task('img-min', () => {
  return gulp.src([
    './src/img/**/*',
    '!./src/img/readme.md'
  ])
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imagemin.svgo({
        plugins: [{
          removeDoctype: false
        }, {
          removeComments: false
        }, {
          cleanupNumericValues: {
            floatPrecision: 2
          }
        }, {
          convertColors: {
            names2hex: false,
            rgb2hex: false
          }
        }]
      })
    ]))
    .pipe(gulp.dest('./img'));
});

gulp.task('img-webp', () =>
  gulp.src([
    './img/**/*.png',
    './img/**/*.jpg',
    '!./img/svg',
    '!./img/webp',
    '!./img/readme.md'
  ])
  .pipe(webp({
    quality: 100,
    method: 6,
  }))
  .pipe(gulp.dest('./img/webp'))
);

gulp.task('watch', () => {
  browserSync.init({
    server: './',
    port: 3000,
    startPath: 'build/html/index.html'
  });

  gulp.watch('./src/html/**/*',  gulp.series('markup'))
    
  gulp.watch('./src/less/**/*.less', gulp.series('styles', 'styles-min', 'replace-url'))
  
  gulp.watch('./src/js/**/*.js', gulp.series('scripts', 'scripts-min'))
  
  gulp.watch('./build/html/**/*').on('change', browserSync.reload);
});

gulp.task('img', gulp.series('img-min', 'img-webp'));

gulp.task('default', gulp.series('del', 'markup', gulp.parallel('styles', 'scripts'), gulp.parallel('styles-min', 'scripts-min'), 'replace-url', 'watch'));