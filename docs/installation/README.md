---
next: /plugins/
---

# Installation

## Using Yarn

```
$ yarn add gulp-html-transform
```

## Using NPM

```
$ npm i --save gulp-html-transform
```

# Usage

**gulpfile.js**

First, import tranform as well as any plugins you wish to use

```js
const { transform, htmlSrcset, lqip } = require('gulp-html-transform')
```

Then, create a gulp task using the transform function, passing any of the plugins you wish you use

```js
gulp.task('html', () => {
  gulp
    .src('src/**/*.html')
    .pipe(
      transform(
        htmlSrcset({
          width: [1, 720],
          format: ['webp', 'jpg'],
        }),
        lqip({
          method: 'primaryColor',
        }),
      ),
    )
    .pipe(gulp.dest('dist'))
})
```

# API

Transform accepts any number of transformer functions.
A transformer function takes a Cheerio Object as input (it's pretty much like jquery), and returns a Promise when done.

```js
const transformer = async $ => {
  $('img').attr('src', 'https://i.imgur.com/HObogkM.gif')
}
```
