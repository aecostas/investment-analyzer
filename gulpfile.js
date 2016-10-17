'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var coveralls = require('gulp-coveralls');
var path = require('path');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var argv = require('yargs').argv;
var gulpif = require('gulp-if');
var changed = require('gulp-changed');
var eslint = require('gulp-eslint');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');

var SRC_FILES = ['src/**/*.js'];
var TEST_FILES = ['test/unit/*.js','test/*.js'];

// Build
////////

gulp.task('build-js', function () {
	return gulp.src(SRC_FILES)
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error %>'),
		}))
		.pipe(changed('./lib'))
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./lib'));
});

gulp.task('build:clean', function () {
	return del(['lib']);
});

gulp.task('build', ['build-js']);

gulp.task('watch', ['build'], function () {
    gulp.watch([SRC_CS_FILES], ['build-cs']);
    gulp.watch([SRC_FILES], ['build-js']);
});

// Lint
///////
gulp.task('lint:src', function() {
    gulp.src(SRC_FILES)
	.pipe(eslint())
	.pipe(eslint.format())
});

gulp.task('lint:test', function() {
    gulp.src(TEST_FILES)
	.pipe(eslint({fix: true}))
	.pipe(eslint.format());
});

gulp.task('lint', ['lint:src', 'lint:test']);


// Documentation
////////////////

gulp.task('doc', function () {
	var esdoc = require('gulp-esdoc');
	var access = (argv.production) ? ['public'] : ['public', 'protected', 'private'];
	return gulp.src('./src')
		.pipe(esdoc({
			'destination': './doc',
			'excludes': ['vendor'],
			'coverage': true,
			'access': access,
		}));
	});

gulp.task('doc:clean', function() {
	return del(['doc']);
});


// Tests
////////////////////

gulp.task('pre-test', function () {
    return gulp.src(SRC_FILES)
    // Covering files
        .pipe(istanbul())
    // Force `require` to return covered files
        .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function () {
    gulp.src('test/unit/*.js')
        .pipe(mocha())
        .pipe(istanbul.writeReports())
    // Enforce a coverage of at least 90%
    //              .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } })))
});

gulp.task('coveralls', ['test'], function () {
    if (!process.env.CI) {
	return;
    }
    
    return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
        .pipe(coveralls());
});

gulp.task('clean', ['build:clean', 'dist:clean', 'doc:clean']);
gulp.task('default', ['build','lint','test','coveralls']);
