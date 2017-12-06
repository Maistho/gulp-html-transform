# gulp-html-transform
Applies a transform to some html

## Plugins
- [gulp-html-lqip](https://github.com/maistho/gulp-html-lqip) Adds low quality image placeholders to your html 
- [gulp-html-srcset](https://github.com/maistho/gulp-html-srcset) Expands your image srcset with more sources

## Installing

Using npm
```
$ npm install --save gulp-html-transform
```

Using yarn
```
$ yarn add gulp-html-transform
```

## Usage

#### gulpfile.js
```javascript
const { transform } = require('gulp-html-transform')
const { htmlSrcset } = require('gulp-html-srcset')
const { lqip } = require('gulp-html-lqip')

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
  $('img').src = 'https://i.imgur.com/aKaOqIh.gif'
}
```

