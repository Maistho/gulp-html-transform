import { Transformer } from '../../transform'

const chalk = require('chalk')

export const insertFA = (styles: any[]): Transformer => {

  let fontawesome: any

  try {
    fontawesome = require('@fortawesome/fontawesome')
  } catch (err) {
    console.warn(`${chalk.red('@fortawesome/fontawesome')} is not installed, <fa-icon> will not work`)

    return async () => {
      // noop
    }
  }

  for (let style of styles) {
    fontawesome.library.add(style)
  }

  return async ($: CheerioStatic) => {
    $('head').append(`<style>${fontawesome.dom.css()}</style>`)

    $('fa-icon').each((i, el) => {
      const $el = $(el)

      const icon = fontawesome.icon({
        prefix: 'fas',
        iconName: $el.text().trim(),
      }).html[0]

      const newEl = $(icon)

      $el.replaceWith(newEl)
    })
  }
}
