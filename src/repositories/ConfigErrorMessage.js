import errorsTH from '@/views/create-po/utils/errorsTH'
import errors from '@/views/create-po/utils/errors'

export const getErrorMessageByCountry = (country) => {
  switch (country) {
    case 'TH':
      return errorsTH

    default:
      return errors
  }
}
