// @flow

import validateIndividual from './validateIndividual'
import * as t from './types'

// NOTE: We don't validate any extra args
function validate(
  types: Array<any>,
  values: Array<any>,
  method: ?string = null,
  className: ?string = null,
  aliases: Array<string> = [],
) {
  let prefix = method ? `${method}() expects` : 'expected'
  if (className) {
    prefix = `${className}#${prefix}`
  }

  types.forEach(function(type, index) {
    const value = values[index]
    const alias = aliases[index] || `Parameter ${index + 1}`
    try {
      validateIndividual(type, value, index, types, values, false)
    } catch (error) {
      error.message = `${prefix} ${alias}${error.message}`
      throw error
    }
  })
}

function validateMethod(...types: Array<any>) {
  return function(target: Object, key: string, descriptor: Object) {
    const className = target.constructor.name || 'Object'
    validate([Function], [descriptor.value], 'validateMethod', null, [`${className}#${key}`])

    const realCallback = descriptor.value
    const validationCallback = function(...values) {
      validate(types, values, key, className)
      return realCallback(...values)
    }
    Object.setPrototypeOf(validationCallback.prototype, target)

    // eslint-disable-next-line no-param-reassign
    descriptor.value = validationCallback

    return descriptor
  }
}

export { validate, validateMethod, t }
