var gulp = require('gulp');
var less = require('gulp-less');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');
var rimraf = require('gulp-rimraf');
var inject = require('gulp-inject');

var paths = {
  less: ['./src/less/app.less'],
  js: ['./src/js/**/_module.js', './src/js/**/*.js'],
  build: {
    css: './build/css',
    js: './build/js'
  },
  dist: {
    css: './dist/css/',
    js: './dist/js/',
  },
  vendor: {
    css: [],
    js: [
      './bower_components/angular/angular.js',
      './bower_components/angular-ui-router/release/angular-ui-router.js',
      './bower_components/angular-local-storage/angular-local-storage.js'
    ]
  }
};

/**
 * Deletes the content of the build and dist folders
 */
gulp.task('clean', function () {
  gulp
    .src([
      './build/**/*',
      './dist/**/*'
    ], {
      read: false
    })
    .pipe(rimraf());
});


gulp.task('less', function () {
  gulp
    .src(paths.less)
    .pipe(less())
  // .pipe(minify())
  .pipe(gulp.dest(paths.build.css));
});

gulp.task('scripts', function () {
  gulp
    .src(paths.js)
    .pipe(concat('app.js'))
  // .pipe(ngAnnotate())
  // .pipe(uglify())
  .pipe(gulp.dest(paths.build.js));
});

gulp.task('vendor', function () {
  gulp
    .src(paths.vendor.js)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.build.js));
});

gulp.task('templates', function () {
  gulp
    .src('src/js/**/*.html')
    .pipe(templateCache({
      module: 'app'
    }))
  // .pipe(ngAnnotate())
  // .pipe(uglify())
  .pipe(gulp.dest(paths.build.js));
});

gulp.task('jshint', function () {
  gulp
    .src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function () {
  gulp.watch(paths.less, ['less']);
  gulp.watch('src/js/**/*.js', ['jshint', 'scripts']);
  gulp.watch('src/js/**/*.html', ['templates']);
});

gulp.task('inject', ['less', 'vendor', 'scripts', 'templates'], function () {
  var sources = gulp.src(['**/*.css', 'js/**/*.js'], {
    read: false,
    cwd: 'build'
  });

  gulp
    .src('./src/index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('./build'))
});

gulp.task('default', ['jshint', 'less', 'scripts', 'templates', 'vendor', 'inject', 'watch']);
