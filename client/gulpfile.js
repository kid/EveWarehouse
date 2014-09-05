var gulp = require('gulp');
var less = require('gulp-less');
var order = require('gulp-order');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var angularFilesort = require('gulp-angular-filesort');
var templateCache = require('gulp-angular-templatecache');
var rimraf = require('gulp-rimraf');
var inject = require('gulp-inject');
var rev = require('gulp-rev');
var es = require('event-stream');

var paths = {
  index: './src/index.html',
  less: ['./src/less/app.less'],
  js: ['./src/js/**/_module.js', './src/js/**/*.js'],
  templates: ['./src/js/**/*.html'],
  dist: {
    css: './dist/css/',
    js: './dist/js/',
  },
  vendor: {
    // Use already minified version
    js: [
      './bower_components/angular/angular.min.js',
      './bower_components/angular-ui-router/release/angular-ui-router.min.js',
      './bower_components/angular-local-storage/angular-local-storage.min.js'
    ]
  }
};

function BuildStyles() {
  return gulp
    .src(paths.less)
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(minify())
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist.css));
}

function BuildVendors() {
  return gulp
    .src(paths.vendor.js)
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist.js));
}

function BuildScripts() {
  var scriptsStream = gulp.src(paths.js);
  var templatesStream = gulp.src(paths.templates).pipe(templateCache({
    module: 'app'
  }));

  return es.merge(scriptsStream, templatesStream)
    .pipe(order([
      'app.js',
      'templates.js'
    ]))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist.js));
}

gulp.task('build', function () {
  var sources = es.merge(BuildVendors(), BuildStyles(), BuildScripts());
  sources = sources.pipe(order([
    'vendor-*.{css,js}',
    'app-*.{css,js}'
  ]));

  gulp
    .src(paths.index)
    .pipe(inject(sources, {
      relative: true,
      ignorePath: '../dist'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {
  es.wait(gulp.src('./dist/**/*', {
    read: false
  }).pipe(rimraf()));
});

gulp.task('jshint', function () {
  gulp
    .src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function () {
  gulp.watch('src/**/*', ['clean', 'build']);
});

gulp.task('default', ['clean', 'jshint', 'build', 'watch']);
