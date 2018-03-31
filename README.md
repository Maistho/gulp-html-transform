# gulp-html-transform

[![NPM version][npm]][npm-url]
[![Node version][node]][node-url]
[![Dependency status][deps]][deps-url]

[npm]: https://img.shields.io/npm/v/gulp-html-transform.svg
[npm-url]: https://www.npmjs.com/package/gulp-html-transform

[node]: https://img.shields.io/node/v/gulp-html-transform.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/david/Maistho/gulp-html-transform.svg
[deps-url]: https://david-dm.org/Maistho/gulp-html-transform

Transforms some html using transformer functions

## Installing

```bash
$ yarn add gulp-html-transform
```

## Plugins

- `insertFA`: transforms `<fa-icon>` into Font Awesome icons.
- `insertGA`: Inserts google analytics into `<head>`.
- `lqip`: Replaces images with [low quality image placeholders](https://github.com/zouhir/lqip). WARNING: Adds html, so may mess with your css selectors or other things.
- `minifyInlineJson`: Minifies inline JSON.
- `htmlSrcset`: Expands `srcset` in your `<img>`.

## Usage

#### gulpfile.js
```javascript
const { transform, htmlSrcset, lqip } = require('gulp-html-transform')

gulp.task('html', () => {
  gulp.src('src/**/*.html')
  .pipe(transform(
    htmlSrcset({
      width: [1, 720],
      format: ['webp', 'jpg'],
    }),
    lqip({
      base: __dirname,
    })
  ))
  .pipe(gulp.dest('dist'))
})
```

## API
transform accepts any number of transformer functions.

A transformer function takes a Cheerio Object as input (it's pretty much like jquery), and returns a Promise when done.

```javascript
// Example transformer function
const transformer = async ($) => {
  $('img').src = 'https://i.imgur.com/HObogkM.gif'
}
```

