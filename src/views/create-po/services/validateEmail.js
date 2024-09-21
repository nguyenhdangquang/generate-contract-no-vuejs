import { ErrorMessage } from '@/repositories/ErrorMessage'
import validator from 'validator'

export const validateEmail = (emailAddress) => {
  const isEmpty = validator.isEmpty(emailAddress, { ignore_whitespace: true })
  if (isEmpty) {
    return ErrorMessage.EMAIL_REQUIRED
  }

  const hasValidLength = validator.isLength(emailAddress, {
    max: 200
  })
  if (!hasValidLength) {
    return ErrorMessage.EMAIL_MAX_LENGTH_200
  }

  const isValidEmailAddress = validator.isEmail(emailAddress, {
    allow_utf8_local_part: false,
    allow_ip_domain: false,
    require_tld: true,
    blacklisted_chars: '*$#{}+%<>\\?\\[\\]:;\\!\'"\\(\\)|~=\\^`',
    ignore_max_length: true
  })
  if (!isValidEmailAddress) {
    return ErrorMessage.EMAIL_VALID
  }

  return ErrorMessage.DEFAULT
}
