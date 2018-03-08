import { Transformer } from '../../transform'

const chalk = require('chalk')
let fontawesome: any

try {
  fontawesome = require('@fortawesome/fontawesome')
} catch (err) {
  console.warn(`${chalk.red('@fortawesome/fontawesome')} is not installed, <fa-icon> will not work`)
}

if (fontawesome) {

  const styles = ['pro-solid', 'pro-regular', 'pro-light', 'free-brands']

  for (let style of styles) {
    try {
      const s = require(`@fortawesome/fontawesome-${style}`)
      fontawesome.library.add(s)
    } catch (err) {
      console.warn(`@fortawesome/fontawesome-${style} is not installed`)
    }
  }
}

export const insertFA = (): Transformer => {
  return async ($: CheerioStatic) => {
    if (!fontawesome) {
      return
    }

    $('head').append(`<style>${fontawesome.dom.css()}</style>`)

    $('fa-icon').each((i, el) => {
      const $el = $(el)

      const newEl = $($.html(fontawesome.icon({
        prefix: 'fas',
        iconName: $el.attr('icon'),
      })))

      $el.replaceWith(newEl)
    })
  }
}
