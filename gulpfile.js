/* -------------------------------
   General
---------------------------------- */

/* Include Gulp */

var gulp = require('gulp'); 

/* Include Plugins */

var clean = require('gulp-clean');
var concat = require('gulp-concat');
var filesize = require('gulp-filesize');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var minifyCss = require('gulp-minify-css');
var imageop = require('gulp-image-optimization');
var gulpJade = require('gulp-jade');
var ts = require('gulp-typescript');

/* Clean */

gulp.task('clean', function () {  
  return gulp.src('build', {read: false})
    .pipe(clean());
});


/* -------------------------------
   Preprocessors plugins 
---------------------------------- */


/* SASS */

gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});

/* TypeScript */

gulp.task('ts', function () {
  return gulp.src('ts/*.ts')
    .pipe(ts({
      noImplicitAny: true,
      out: 'main.js'
    }))
    .pipe(gulp.dest('js'));
});


/* -------------------------------
   Optimalization plugins 
---------------------------------- */


/* Concatenate & Minify Javascript */

gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(filesize())
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(filesize());
});

/* Minify CSS */

gulp.task('minify-css', function() {
  return gulp.src('css/*.css')
  	.pipe(concat('main.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(filesize())
    .pipe(rename('main.min.css'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'))
    .pipe(filesize());
});

/* Optimize images */

gulp.task('images', function(cb) {
    gulp.src(['img/**/*.png','img/*.jpg','img/**/*.gif','img/**/*.jpeg']).pipe(imageop({
        optimizationLevel: 10,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('dist/img')).on('end', cb).on('error', cb);
});



/* -------------------------------
   Other plugins
---------------------------------- */


/* Javascript debugger */

gulp.task('jshint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/* Watch files for changes */

gulp.task('watch', function() {
    gulp.watch('js/*.js', ['jshint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('ts/*.ts', ['ts']);
});

/* Default tasks */

gulp.task('default', ['clean', 'jshint', 'sass', 'scripts', 'watch', 'minify-css']);