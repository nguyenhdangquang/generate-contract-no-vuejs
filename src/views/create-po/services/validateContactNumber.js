import { ErrorMessage } from '../../../repositories/ErrorMessage'

export const validateContactNumber = (contactNumber) => {
  let error = ErrorMessage.DEFAULT
  var eightNumericRegex = /^[0-9]{8,12}$/
  var notNumericRegex = /\D+/

  if (!contactNumber) {
    error = ErrorMessage.CONTACT_REQUIRED
  } else if (notNumericRegex.test(contactNumber)) {
    error = ErrorMessage.CONTACT_NUMBER_ONLY
  } else if (!eightNumericRegex.test(contactNumber)) {
    error = ErrorMessage.CONTACT_MAX_LENGTH
  }

  return error
}
