import { lqip } from './lqip'

import { testTransform } from '../../test/helpers'

describe('lqip', () => {
  const filename = 'image.html'
  it('creates a base64 lqip', async () => {
    const content = await testTransform(filename, [lqip()])
    expect(content).toMatchSnapshot()
  })
  it('creates a background-color', async () => {
    const content = await testTransform(filename, [
      lqip({ method: 'primaryColor' }),
    ])
    expect(content).toMatchSnapshot()
  })
})
