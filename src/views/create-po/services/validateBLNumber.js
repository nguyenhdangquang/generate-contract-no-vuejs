export const validateBLNumber = (blNumber, typeErrorMessage) => {
  if (!blNumber) {
    return typeErrorMessage.BL_NUMBER_ERRORS.Required
  }

  const containsMax16Chars = /^[0-9a-zA-Z]{1,16}$/
  if (!containsMax16Chars.test(blNumber)) {
    return typeErrorMessage.BL_NUMBER_ERRORS.MaxLength16
  }

  return null
}
