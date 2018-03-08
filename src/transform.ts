import * as through from 'through2'
import * as cheerio from 'cheerio'
import * as File from 'vinyl'
import * as stream from 'stream'

export type Transformer = ($: CheerioStatic) => Promise<void>

export function transform (...args: Transformer[]): stream.Transform {
  return through.obj(async (file: File, enc, cb) => {
    if (!file || file.isNull() || file.isStream() || !file.contents) {
      return cb(null, file)
    }

    const content = file.contents.toString()
    const $ = cheerio.load(content)

    for (const transformer of args) {
      try {
        await transformer($)
      } catch (err) {
        return cb(err)
      }
    }

    file.contents = new Buffer($.html())
    cb(null, file)
  })
}

export default transform
