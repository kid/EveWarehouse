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

gulp.task('styles', function () {
  gulp
    .src('src/css/app.less')
    .pipe(less())
    .pipe(minify({
      keepBreak: true
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('scripts', function () {
  gulp
    .src(['src/js/**/module.js', 'src/js/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('templates', function () {
  gulp
    .src('src/js/**/*.html')
    .pipe(templateCache())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('jshint', function () {
  gulp
    .src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
})

gulp.task('watch', ['jshint', 'scripts', 'styles', 'templates'], function () {
  gulp.watch('src/css/**/*.less', ['styles']);
  gulp.watch('src/js/**/*.js', ['jshint', 'scripts']);
  gulp.watch('src/js/**/*.html', ['templates']);
});
