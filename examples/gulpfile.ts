const gulp = require('gulp')

const { transform, htmlSrcset, lqip } = require('../src')

gulp.task('html', () => {
  gulp
    .src('src/**/*.html')
    .pipe(
      transform(
        htmlSrcset({
          width: [1, 720],
          format: ['webp', 'jpg'],
        }),
        lqip({ query: '.image', addStyles: true }),
        lqip({ query: '.palette', method: 'primarycolor', addStyles: true }),
      ),
    )
    .pipe(gulp.dest('dist'))
})

gulp.task('images', () => {
  gulp.src('src/**/*.jpg').pipe(gulp.dest('dist'))
})

gulp.task('default', ['html', 'images'])
