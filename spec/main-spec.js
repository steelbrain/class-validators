/* @flow */

import { validateMethod } from '..'

class Something {
  @validateMethod(String, Number)
  something(...values) {
    console.log('Hi!!', values)
  }
}

const something = new Something()

describe('class-validators', function() {
  it('is nice?', function() {
    expect(function() {
      something.something(2, 'hi')
    }).toThrow()

    expect(function() {
      something.something('hi', 2)
    }).not.toThrow()
  })
})
