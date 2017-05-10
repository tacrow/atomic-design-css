'use strict';

var gulp = require('gulp'),
		$ = require('gulp-load-plugins')(),
		del = require('del'),
		runSequence = require('run-sequence');

var plugins = [
	require('postcss-easy-import'),
	require('autoprefixer'),
	require('postcss-sassy-mixins'),
	require('postcss-nested'),
	require('postcss-simple-vars'),
	require('stylelint'),
	require('postcss-reporter')({ clearMessages: true })
];

var cssnano = [
	require('cssnano')({ mergeRules: false })
];

var src = {
	postCss:   'src/postcss/**/*.css',
	targetCss: 'src/postcss/all.css',
	css:       'src/css',
	allCss:    'src/css/all.css',
	buildCss:  'src/build/css'
};

// Clean output directory
gulp.task('clean', del.bind(null, ['src/css/*.{css,css.map}']));


gulp.task('postcss', function() {
	return gulp.src(src.targetCss)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.postcss(plugins))
		.pipe($.sourcemaps.write('./maps'))
		.pipe(gulp.dest(src.css));
});

gulp.task('cssnano', function() {
	return gulp.src(src.allCss)
		.pipe($.plumber())
		.pipe($.postcss(cssnano))
		.pipe($.rename({ suffix: '.min' }))
		.pipe(gulp.dest(src.buildCss));
});

// build
gulp.task('build', function() {
	return runSequence('clean', 'postcss', 'cssnano');
});

// watch
gulp.task('watch', function() {
	gulp.watch(src.postCss, ['postcss']);
});

// default
gulp.task('default', ['watch']);