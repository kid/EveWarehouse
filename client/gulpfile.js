var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('less', function () {
  return gulp
    .src('src/css/app.less')
    .pipe(less())
    .pipe(gulp.dest('dist'))
});

gulp.task('js', function () {
  gulp
    .src(['src/js/**/module.js', 'src/js/**/*.js'])
    //.pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['js', 'less'], function () {
  gulp.watch('src/css/**/*.less', ['less']);
  gulp.watch('src/js/**/*.js', ['js']);
});
