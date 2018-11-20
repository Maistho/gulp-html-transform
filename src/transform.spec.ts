import { testTransform } from './test/helpers'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('gulp-html-transform', () => {
  it(`doesn't change anything if there is no transforms`, async () => {
    const filename = 'test.html'
    const content = await testTransform(filename, [])
    const fileContent = readFileSync(
      join(__dirname, 'test', filename),
    ).toString()
    expect(content).toBe(fileContent)
  })
  it(`can accept a transformer`, async () => {
    const transformer = async ($: any) => {
      $('img').attr('src', 'https://i.imgur.com/HObogkM.gif')
    }
    const content = await testTransform('image.html', [transformer])
    expect(content).toMatchSnapshot()
  })
})
