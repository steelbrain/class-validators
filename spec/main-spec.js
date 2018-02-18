// @flow

import { validateMethod } from '../'

class Something {
  @validateMethod(String, Number)
  something(...values) {
    console.log('Hi!!', values)
  }
}

const something = new Something()

try {
  something.something(2, 'hi')
  process.exitCode = 1
} catch (_) {
  /* No Op */
}

something.something('hi', 2)
