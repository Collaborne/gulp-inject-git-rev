'use strict';

const git = require('git-rev');
const gulp = require('gulp');
const lazypipe = require('lazypipe');
const replace = require('gulp-replace');
const size = require('gulp-size');

/**
 * Loads Git revision
 * 
 * This task needs to be executed before using `injectGitRev` in a pipe().
 * Solution suggested by http://mcranston18.github.io/gulp-piping/
 */
let gitRev;
gulp.task('fetch-git-rev', function(cb) {
	git.short(function(aGitRev) {
		gitRev = aGitRev;
		cb();
	});
});

/**
 * Creates a gulp.pipe() function that replaces the gitRev placeholder with the
 * current value for git rev.
 * 
 * @returns {Function}
 */
function injectGitRev() {
	if (!gitRev) {
		throw new Error('GitRev isn\'t set. Execute task "fetch-git-rev" before using this function.');
	}

	return replace('%%GULP.GIT_REV_VERSION%%', gitRev);
};

module.exports = lazypipe()
		.pipe(injectGitRev)
		.pipe(() => size({title: 'inject-git-rev'}));
