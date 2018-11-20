import { join } from 'path'
import * as File from 'vinyl'
import { readFileSync } from 'fs'

import { Transformer, transform } from '../transform'

export const testTransform = (
  filename: string,
  transformers: Transformer[],
): Promise<string> => {
  const path = join(__dirname, filename)
  const file = new File({
    path,
    contents: readFileSync(path),
  })
  const transformer = transform(...transformers)
  transformer.write(file)
  return new Promise((resolve, reject) => {
    transformer.once('data', (file: File) => {
      if (!file.contents) {
        return reject(file)
      }
      return resolve(file.contents.toString())
    })
  })
}
