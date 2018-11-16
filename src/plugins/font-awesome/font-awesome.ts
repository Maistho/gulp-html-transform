import { Transformer } from '../../transform'

const chalk = require('chalk')

const noop = async () => {
  // noop
}

export const insertFA = (styles: any[], prefix = 'fas'): Transformer => {
  let fontawesome: any

  try {
    fontawesome = require('@fortawesome/fontawesome')
  } catch (err) {
    console.warn(
      `${chalk.red(
        '@fortawesome/fontawesome',
      )} is not installed, <fa-icon> will not work`,
    )

    return noop
  }

  if (!styles || !styles.length) {
    console.warn(
      `${chalk.red(
        'insertFA',
      )} was not given any icon sets, <fa-icon> will not work`,
    )
    return noop
  }

  for (let style of styles) {
    fontawesome.library.add(style)
  }

  return async ($: CheerioStatic) => {
    $('head').prepend(`<style>${fontawesome.dom.css()}</style>`)

    $('fa-icon').each((i, el) => {
      const $el = $(el)

      const iconName = $el.text().trim()
      const icon = fontawesome.icon({
        prefix: el.attribs['prefix'] || prefix,
        iconName,
      })
      if (!icon) {
        console.warn(`Did not find an icon with name '${iconName}'`)
        return
      }

      const newEl = $(icon.html[0])
      newEl.addClass($el.attr('class'))

      $el.replaceWith(newEl)
    })
  }
}
