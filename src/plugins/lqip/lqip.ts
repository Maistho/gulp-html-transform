import * as path from 'path'
import * as fs from 'fs'
import { promisify } from 'util'

import { Transformer } from '../../transform'
const { base64 } = require('lqip')

const sizeOf = promisify(require('image-size'))
const readFile = promisify(fs.readFile)

export interface LqipOptions {
  base: string
  query?: string
  addStyles?: boolean
}

export const lqip = (options: LqipOptions): Transformer => {
  if (!options.base) {
    throw new Error('Missing required parameter `base` from options')
  }

  options = Object.assign({
    query: 'img[src]',
  }, options)

  return async ($: CheerioStatic) => {
    const promises: Promise<void>[] = []

    if (options.addStyles) {
      promises.push(readFile(path.join(__dirname, 'lqip.css'), { encoding: 'utf-8' }).then(styles => {
        $('head').append(`<style>${styles}</style>`)
      }))
    }

    const elements = $(options.query).toArray().map(el => $(el))

    for (const $el of elements) {
      const filepath = path.join(options.base, $el.attr('src'))

      const p = Promise.all([
        base64(filepath),
        sizeOf(filepath),
      ]).then(([res, dimensions]) => {
        const wrapper = $('<div />')
        wrapper.css('padding-top', ((dimensions.height / dimensions.width) * 100).toFixed(4) + '%')
        wrapper.css('background-image', `url(${res})`)
        wrapper.attr('class', `lqip blur ${$el.attr('class')}`)
        const clone = $el.clone()
        clone.attr('onload', 'this.parentElement.classList.remove(\'blur\')')
        clone.attr('class', '')
        wrapper.append(clone)
        $el.replaceWith(wrapper)
      }, () => {
        // noop
      })
      promises.push(p)
    }

    await Promise.all(promises)
  }
}
