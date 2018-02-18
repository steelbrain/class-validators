// @flow

type ValidationType = 'any' | 'var-args' | 'optional' | 'instance'
type SpecialType<T> = { type: ValidationType, of: T }

export function varArgs<T>(type: T): SpecialType<T> {
  return {
    type: 'var-args',
    of: type,
  }
}
export function optional<T>(type: T): SpecialType<T> {
  return {
    type: 'optional',
    of: type,
  }
}
export function any(): SpecialType<'any'> {
  return {
    type: 'any',
    of: 'any',
  }
}
export function instanceOf<T>(type: T): SpecialType<T> {
  return {
    type: 'instance',
    of: type,
  }
}
