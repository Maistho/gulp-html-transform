# gulp-html-transform
Applies a transform to some html


## Installing

```
$ yarn add gulp-html-transform
```

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
  $('img').src = 'https://i.imgur.com/aKaOqIh.gif'
}
```

