// @flow

const primitiveTypes = new Map([
  [String, 'string'],
  [Number, 'number'],
  [Boolean, 'boolean'],
  [Symbol, 'symbol'],
  [Function, 'function'],
])

function getPrintableType(type: any) {
  let prefix = ''
  let postfix = ''
  if (type && type.type) {
    switch (type.type) {
      case 'var-args':
        postfix = '...'
        break
      case 'optional':
        prefix = '?'
        break
      case 'any':
        return 'any'
      default:
    }
  }

  if (type.of) {
    return prefix + getPrintableType(type.of) + postfix
  }
  if (typeof type === 'string') {
    return prefix + type + postfix
  }
  if (typeof type === 'object') {
    return (
      prefix + JSON.stringify(type, (key, value) => (typeof value === 'object' ? value : getPrintableType(value))) + postfix
    )
  }
  return prefix + type.name + postfix
}

export default function validateIndividual(
  givenType: any,
  value: any,
  index: number,
  types: Array<any>,
  values: Array<any>,
  isObjectProperty: boolean,
): void {
  let type = givenType
  if (value === null || typeof value === 'undefined') {
    if (type.type === 'optional' || type.type === 'any') {
      return
    }
    throw new Error(` to be non-null ${getPrintableType(type)}`)
  }

  if (type.type === 'optional') type = type.of
  if (type.type === 'any') return
  if (type.type === 'var-args') {
    if (isObjectProperty) {
      throw new Error(' to have variadic inside Object property')
    }
    if (index !== types.length - 1) {
      throw new Error(` to be last type. Got index: ${index} instead of ${types.length}`)
    }
    try {
      values
        .slice(index)
        .every((item, itemIndex) => validateIndividual(type.of, item, itemIndex, types, values, isObjectProperty))
    } catch (error) {
      error.message = `+${error.message}`
      throw error
    }
    return
  }
  if (type.type === 'instance') {
    if (!(value instanceof type.of)) {
      throw new Error(
        ` to be an instance of ${getPrintableType(type)}. Got: ${
          value ? value.name || value.constructor.name : typeof value
        }`,
      )
    }
    return
  }
  if (type && type.constructor.name === 'Object') {
    if (!value || typeof value !== 'object') {
      throw new Error(` to be ${getPrintableType(type)}. Got: ${typeof value}`)
    }

    Object.keys(type).forEach(function(key) {
      try {
        validateIndividual(type[key], value[key], index, types, values, true)
      } catch (error) {
        error.message = `->${JSON.stringify(key)}${error.message}`
        throw error
      }
    })
    return
  }
  if (Array.isArray(type)) {
    if (!value || !Array.isArray(value)) {
      throw new Error(` to be ${getPrintableType(type)}`)
    }
    type.forEach((item, itemIndex) => {
      try {
        validateIndividual(item, value[index], itemIndex, type, value, false)
      } catch (error) {
        error.message = `[${index}]${error.message}`
        throw error
      }
    })
    return
  }

  const primitiveType = primitiveTypes.get(type)
  if (primitiveType) {
    // eslint-disable-next-line valid-typeof
    if (typeof value !== primitiveType) {
      throw new Error(` to be ${primitiveType}. Got: ${typeof value}`)
    }
    return
  }
  throw new Error(` to have a valid type. Got: ${type}`)
}
