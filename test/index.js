/* jshint node: true */

'use strict';

const injectGitRev = require('../');
const fs = require('fs');
const git = require('git-rev');
const gulp = require('gulp');
const path = require('path');
const should = require('should');
const File = require('vinyl');

const FIXTURE_PAGE = fs.readFileSync(path.join(__dirname, 'fixtures/page.html'));

describe('gulp-inject-git-rev', function() {

	let check, _gitRev;

	beforeEach(function(done) {
		const files = [
			new File({
				path: 'simple.html',
				contents: fs.readFileSync(path.join(__dirname, 'fixtures/simple.html'))
			}),
			new File({
				path: 'page.html',
				contents: FIXTURE_PAGE
			}),
		];

		// Function to collects all created files
		check = function(stream, done, cb) {
			const newFiles = {};
			stream.on('data', function(newFile) {
				newFiles[newFile.path] = newFile;
			});
			stream.on('end', function(newFile) {
				cb(newFiles);
				done();
			});

			files.forEach(file => stream.write(file));
			stream.end();
		};

		// Capture the current git rev
		git.short(function(gitRev) {
			_gitRev = gitRev;
			done();
		});
	});

	it('Pre-condition: This looks like a git revision', function() {
		_gitRev.length.should.equal(7);
	});

	it('injects the revision number', function(done) {
		// Run fetch-git-rev before executing the test
		gulp.task('test', ['fetch-git-rev'], () => {
			const stream = injectGitRev();

			check(stream, done, function(files) {
				const transformedFile = files['simple.html'];
				String(transformedFile.contents).should.equal(_gitRev);
			});
		});
		gulp.start('test');
	});

	it('injects the revision number in a complex document', function(done) {
		// Run fetch-git-rev before executing the test
		gulp.task('test', ['fetch-git-rev'], () => {
			const stream = injectGitRev();

			check(stream, done, function(files) {
				const expected = String(FIXTURE_PAGE).replace(/%%GULP.GIT_REV_VERSION%%/g, _gitRev);

				const transformedFile = files['page.html'];
				String(transformedFile.contents).should.equal(expected);
			});
		});
		gulp.start('test');
	});

});
