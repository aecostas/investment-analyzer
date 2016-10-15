'use strict';

var gulp = require('gulp');
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

var SRC_FILES = ['src/**/*.js', '!**/vendor/**'];
var TEST_FILES = ['tests/**/*.js'];

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

function isFixed(file) {
    return file.eslint != null && file.eslint.fixed;
}

gulp.task('lint:src', function() {
    gulp.src(SRC_FILES)
	.pipe(eslint())
	.pipe(eslint.format())
	.pipe(gulpif(isFixed,gulp.dest('src')));
});

gulp.task('lint:test', function() {
    gulp.src(TEST_FILES)
	.pipe(eslint({fix: true}))
	.pipe(eslint.format())
	.pipe(gulpif(isFixed,gulp.dest('tests')));
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

gulp.task('test', function () {
    gulp.src('test/unit/*.js')
        .pipe(mocha({
	    clearRequireCache: true,
	    ignoreLeaks: true
	}));
});



gulp.task('clean', ['build:clean', 'dist:clean', 'doc:clean']);
gulp.task('default', ['build']);
