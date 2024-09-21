import { PO_NUMBER_ERRORS } from '../utils/errors'

export function validatePoNumber (po, countryCode) {
  if (!po || !po.poNumber) {
    return PO_NUMBER_ERRORS('PO_NUMBER_REQUIRED', countryCode)
  }
  const { poNumber, payStatus } = po
  const REGEX_NON_ALPHABET_NUMMERIC = /[^a-zA-Z0-9]/
  if (REGEX_NON_ALPHABET_NUMMERIC.test(poNumber)) {
    return PO_NUMBER_ERRORS('PO_NUMBER_CONTAINS_SPECIAL_CHARACTER', countryCode)
  }

  if (poNumber.length !== 12) {
    return PO_NUMBER_ERRORS('PO_NUMBER_12_CHARACTERS', countryCode)
  }

  const endsWith6Digits = /[0-9]{6}$/.test(poNumber)
  if (!endsWith6Digits) {
    return PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', countryCode)
  }

  const countryCodeGroup = poNumber.slice(0, 2)
  if (countryCodeGroup !== countryCode) {
    return PO_NUMBER_ERRORS('PO_NUMBER_WRONG_COUNTRY', countryCode)
  }

  const yearGroup = parseInt(poNumber.slice(2, 4))
  if (Number.isNaN(yearGroup)) {
    return PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', countryCode)
  }
  const currentYear = parseInt(new Date().getUTCFullYear().toString().substr(-2))
  const lessThanOrEqualToCurrentYear = yearGroup <= currentYear
  if (!lessThanOrEqualToCurrentYear) {
    return PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', countryCode)
  }

  const monthGroup = parseInt(poNumber.slice(4, 6))
  if (Number.isNaN(monthGroup)) {
    return PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', countryCode)
  }
  const monthMustInRange = monthGroup >= 1 && monthGroup <= 12
  if (!monthMustInRange) {
    return PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', countryCode)
  }

  if (payStatus === 'Y') {
    return PO_NUMBER_ERRORS('PO_NUMBER_ALREADY_PAID', countryCode)
  }

  return null
}

export function isValidPoFormat (type, countryCode) {
  return !(type === PO_NUMBER_ERRORS('PO_NUMBER_REQUIRED', countryCode).type ||
    type === PO_NUMBER_ERRORS('PO_NUMBER_12_CHARACTERS', countryCode).type ||
    type === PO_NUMBER_ERRORS('PO_NUMBER_INVALID_FORMAT', countryCode).type ||
    type === PO_NUMBER_ERRORS('PO_NUMBER_WRONG_COUNTRY', countryCode).type ||
    type === PO_NUMBER_ERRORS('PO_NUMBER_CONTAINS_SPECIAL_CHARACTER', countryCode).type
  )
}
