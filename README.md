# gulp-inject-git-rev [![Build Status](https://travis-ci.org/Collaborne/gulp-inject-git-rev.svg?branch=master)](https://travis-ci.org/Collaborne/gulp-inject-git-rev) [![Greenkeeper badge](https://badges.greenkeeper.io/Collaborne/gulp-inject-git-rev.svg)](https://greenkeeper.io/)
Gulp plugin to inject the git revision number

## Usage

Install the plugin:

```
npm install gulp-inject-git-rev --save
```

Add the `%%GULP.GIT_REV_VERSION%%` placeholder to any of your files, e.g.:

```
<html>
  <head>
    <script>
      window.REV_VERSION = '%%GULP.GIT_REV_VERSION%%';
      console.log(`This is revision ${window.REV_VERSION}.`);
    </script>
  </head>
  <body>
    Hello world from revision %%GULP.GIT_REV_VERSION%%!
  </body>
</html>
```

Finally, add the plugin to your gulpfile.js:

```
const injectGitRev = require('gulp-inject-git-rev');

gulp.task('default', ['fetch-git-rev'], function() {
  return gulp.src('src/**/*')
    .pipe(injectGitRev())
    .pipe(gulp.dest('dist'));
}
```
