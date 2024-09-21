import { PO_NUMBER_ERRORS } from '../utils/errors'

export function getfield (field) {
  const splitted = field.split('/')
  if (splitted.length === 2) {
    return splitted[1]
  }
  return null
}

export function mappingPayPOError (code, countryCode) {
  return PO_NUMBER_ERRORS(code, countryCode)
}
