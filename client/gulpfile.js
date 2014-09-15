var gulp = require('gulp');
var less = require('gulp-less');
var order = require('gulp-order');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
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
    fonts: './dist/fonts/',
    css: './dist/css/',
    js: './dist/js/',
  },
  build: {
    fonts: './build/fonts/',
    css: './build/css/',
    js: './build/js/'
  },
  vendor: {
    // Use already minified version
    js: [
      './bower_components/angular/angular.min.js',
      './bower_components/angular-ui-router/release/angular-ui-router.min.js',
      './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      './bower_components/angular-local-storage/angular-local-storage.min.js'
    ],
    fonts: [
      './bower_components/bootstrap/fonts/*'
    ]
  }
};

function CopyFonts(dist) {
  return gulp
    .src(paths.vendor.fonts)
    .pipe(gulp.dest(dist === true ? paths.dist.fonts : paths.build.fonts));
}

function BuildStyles(dist) {
  var stream = gulp
    .src(paths.less)
    .pipe(sourcemaps.init())
    .pipe(less())

  stream.on('error', console.error.bind(console));

  if (dist === true) {
    stream = stream.pipe(minify()).pipe(rev());
  }

  return stream
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist === true ? paths.dist.css : paths.build.css));
}

function BuildVendorsScripts(dist) {
  var stream = gulp
    .src(paths.vendor.js)
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'));

  if (dist === true) {
    stream = stream.pipe(rev());
  }

  return stream
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist === true ? paths.dist.js : paths.build.js));
}

function BuildScripts(dist) {
  var scriptsStream = gulp.src(paths.js);
  var templatesStream = gulp.src(paths.templates).pipe(templateCache({
    module: 'app'
  }));

  var stream = es.merge(scriptsStream, templatesStream)
    .pipe(order([
      'app/app.js',
      'templates.js'
    ]))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'));

  if (dist === true) {
    stream = stream.pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(rev())
  }

  return stream
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist === true ? paths.dist.js : paths.build.js));
}

function BuildAll(dist) {
  var sources = es
    .merge(BuildStyles(dist), BuildVendorsScripts(dist), BuildScripts(dist))
    .pipe(order([
      'vendor*',
      'app*'
    ]));

  return gulp
    .src(paths.index)
    .pipe(inject(sources, {
      relative: true,
      ignorePath: dist === true ? '../dist' : '../build'
    }))
    .pipe(gulp.dest(dist === true ? './dist' : './build'));
}



gulp.task('styles', function () {
  BuildStyles(false);
});

gulp.task('vendor', function () {
  BuildVendorsScripts(false);
});

gulp.task('scripts', function () {
  BuildScripts(false);
})

gulp.task('build', function () {
  CopyFonts(false);
  BuildAll(false);
});

gulp.task('dist', function () {
  CopyFonts(true);
  BuildAll(true);
})

gulp.task('clean', function () {
  es.wait(gulp.src('./dist', './dist', {
    read: false
  }).pipe(rimraf({
    force: true
  })));
});

gulp.task('jshint', function () {
  gulp
    .src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch(paths.index, ['build']);
  gulp.watch('src/**/*.less', ['styles']);
  gulp.watch(paths.js, ['jshint', 'scripts']);
  gulp.watch(paths.templates, ['scripts']);
  gulp.watch('build/**').on('change', livereload.changed);
});

gulp.task('default', ['clean', 'jshint', 'build', 'watch']);
