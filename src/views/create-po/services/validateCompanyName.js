import { ErrorMessage } from '@/repositories/ErrorMessage'

export const validateCompanyName = (companyName) => {
  let error = ErrorMessage.DEFAULT

  if (!companyName) {
    error = ErrorMessage.COMPANY_REQUIRED
  } else if (companyName.length > 200) {
    error = ErrorMessage.COMPANY_MAX_LENGTH_200
  }

  return error
}
