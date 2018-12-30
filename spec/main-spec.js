/* @flow */

import test from 'ava'
import { validateMethod } from '..'

class Something {
  @validateMethod(String, Number)
  something(...values) {
    console.log('Hi!!', values)
  }
}

const something = new Something()

test('is nice?', function(t) {
  try {
    something.something(2, 'hi')
  } catch (error) {
    t.pass()
  }

  try {
    something.something('hi', 2)
  } catch (error) {
    t.fail(error)
  }
})
