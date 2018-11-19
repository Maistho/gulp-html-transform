const chalk = require('chalk')
import * as path from 'path'
import { promisify } from 'util'

import { Transformer } from '../../transform'
import { styles } from './lqip.css'

export interface LqipOptions {
  /**
   * @deprecated not needed since 2.1.1, paths are calculated based on the file paths
   */
  base?: string

  /**
   * custom query for finding images
   * @default img[src]
   */
  query?: string

  /**
   * Whether to add the styles to the <head> of your document
   */
  addStyles?: boolean

  /**
   * Whether you want to carry the images classlist to the generated container.
   */
  carryClassList?: boolean

  /**
   * Whether you want lqip to generate form the data-src attribute rather than src.
   */
  useDataSrc?: boolean

  /**
   * Extra classes to add to wrapper
   */
  classList?: string

  /**
   * Use primary color instead of low quality image
   */
  preferColors?: boolean
}

export const lqip = (options: LqipOptions): Transformer => {
  let base64: any
  let palette: any
  let sizeOf: any
  try {
    base64 = require('lqip').base64
    palette = require('lqip').palette
    sizeOf = promisify(require('image-size'))
  } catch (err) {
    console.warn(
      `lqip requires ${chalk.red('lqip')} and ${chalk.red(
        'image-size',
      )} to be installed`,
    )
    return async () => {
      // noop
    }
  }

  options = Object.assign(
    {
      query: 'img[src]',
    },
    options,
  )

  return async ($: CheerioStatic, { dirname }) => {
    const promises: Promise<void>[] = []

    if (options.addStyles) {
      $('head').prepend(`<style>${styles}</style>`)
    }

    const elements = $(options.query)
      .toArray()
      .map(el => $(el))

    for (const $el of elements) {
      const src = $el.attr(options.useDataSrc ? 'data-src' : 'src')
      const re = /^https?:\/\//i
      if (re.test(src)) {
        return
      }
      const filepath = path.join(options.base || dirname, src)

      const p = Promise.all([
        options.preferColors ? palette(filepath) : base64(filepath),
        sizeOf(filepath),
      ])
        .then(([res, dimensions]) => {
          const wrapper = $('<div />')
          wrapper.css(
            'padding-top',
            ((dimensions.height / dimensions.width) * 100).toFixed(4) + '%',
          )
          if (options.preferColors) wrapper.css('background-color', res[0])
          else wrapper.css('background-image', `url(${res})`)
          wrapper.attr(
            'class',
            'lqip blur ' + options.carryClassList
              ? $el.attr('class')
              : '' + options.classList
              ? options.classList
              : '',
          )
          const clone = $el.clone()
          clone.attr('onload', "this.parentElement.classList.remove('blur')")
          if (options.carryClassList) clone.attr('class', '')
          wrapper.append(clone)
          $el.replaceWith(wrapper)
        })
        .catch(err => {
          console.warn(
            `lqip: Received an error when trying to load ${chalk.red(
              filepath,
            )}`,
            err,
          )
          throw err
        })
      promises.push(p)
    }

    await Promise.all(promises)
  }
}
