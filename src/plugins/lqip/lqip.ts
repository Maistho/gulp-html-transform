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
   * Use a different attribute for the image source eg. 'data-src'
   * @default src
   */
  srcAttribute?: string

  /**
   * Extra classes to add to wrapper
   */
  classList?: string

  /**
   * Use alternate method for placeholders. Currently supports base64 or primaryColor
   * @default base64
   */
  method?: 'base64' | 'primaryColor'
}

export const lqip = (opt?: LqipOptions): Transformer => {
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

  const options = Object.assign(
    {
      query: 'img[src]',
      method: 'base64',
      srcAttribute: 'src',
    },
    opt,
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
      const src = $el.attr(options.srcAttribute)
      const re = /^https?:\/\//i
      if (re.test(src)) return
      const filepath = path.join(options.base || dirname, src)

      let method = options.method && options.method.toLowerCase()
      const p = Promise.all([
        method === 'primarycolor' ? palette(filepath) : base64(filepath),
        sizeOf(filepath),
      ])
        .then(([res, dimensions]) => {
          const wrapper = $('<div />')

          let aspectRatio = `${(
            (dimensions.height / dimensions.width) *
            100
          ).toFixed(4)}%`
          wrapper.css('padding-top', aspectRatio)

          if (method === 'primarycolor') wrapper.css('background-color', res[0])
          else wrapper.css('background-image', `url(${res})`)

          let wrapperClasses = 'lqip blur'
          if (options.carryClassList) {
            wrapperClasses += ` ${$el.attr('class')}`
          }
          if (options.classList) {
            wrapperClasses += ` ${options.classList}`
          }
          wrapper.attr('class', wrapperClasses)

          const clone = $el.clone()
          clone.attr('onload', "this.parentElement.classList.remove('blur')")

          if (options.carryClassList) {
            clone.attr('class', '')
          }

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
