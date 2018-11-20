import * as through from 'through2'
import * as cheerio from 'cheerio'
import * as File from 'vinyl'
import * as stream from 'stream'

export interface TransformerExtras {
  dirname: string
}

export type Transformer = (
  $: CheerioStatic,
  extras: TransformerExtras,
) => Promise<void>

export const transform = (...args: Transformer[]): stream.Transform => {
  return through.obj(async (file: File, enc, cb) => {
    if (
      !file ||
      file.isNull() ||
      file.isStream() ||
      !file.contents ||
      !args.length
    ) {
      return cb(null, file)
    }

    const content = file.contents.toString()
    const dirname = file.dirname
    const $ = cheerio.load(content)

    for (const transformer of args) {
      try {
        await transformer($, {
          dirname,
        })
      } catch (err) {
        return cb(err)
      }
    }

    file.contents = Buffer.from($.html())
    cb(null, file)
  })
}

export default transform
