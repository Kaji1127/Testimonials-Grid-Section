// Initialize modules
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const Fiber = require('fibers');
const browsersync = require('browser-sync').create();

// Sass Task
function scssTask() {
	return src('app/scss/style.scss', { sourcemaps: true })
		.pipe(
			sass({
				fiber: Fiber,
			})
		)
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync
function browserSyncServe(cb) {
	browsersync.init({
		server: {
			baseDir: '.',
		},
		notify: {
			styles: {
				top: 'auto',
				bottom: '0',
			},
		},
	});
	cb();
}
function browserSyncReload(cb) {
	browsersync.reload();
	cb();
}

// Watch Task
function watchTask() {
	watch('*.html', browserSyncReload);
	watch(['app/scss/**/*.scss', 'app/**/*.js'], series(scssTask, browserSyncReload));
}

// Default Gulp Task
exports.default = series(scssTask, browserSyncServe, watchTask);

// Build Gulp Task
exports.build = series(scssTask);
