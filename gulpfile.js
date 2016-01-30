var gulp = require('gulp');
var jsConcat = require('gulp-concat');
var scss = require('gulp-sass');

gulp.task('default', ['jsConcat', 'scssTranspile', 'watch']);

gulp.task('jsConcat', function() {
  return gulp.src('./src/**/*.js')
    .pipe(jsConcat('app.js'))
    .pipe(gulp.dest('./public/script'));
});

gulp.task('scssTranspile', function() {
  return gulp.src('./src/**/*.scss')
    .pipe(scss('style.css'))
    .pipe(gulp.dest('./public/style'));
});

gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['jsConcat']);
  gulp.watch('./src/**/*.scss', ['scssTranspile']);

});
