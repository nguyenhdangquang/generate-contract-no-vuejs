import { ErrorMessage } from '@/repositories/ErrorMessage'
import { getTextByCountry } from '@/utils/displayTextResources'

export const PO_NUMBER_ERRORS = (typeError, countryCode) => {
  const listError = {
    PO_NUMBER_12_CHARACTERS: {
      type: 'PO_NUMBER_12_CHARACTERS',
      message: getTextByCountry(countryCode, 'payPOPage_poNumber_textbox_errorMsg_12characters')
    },
    PO_NUMBER_DUPLICATED: {
      type: 'PO_NUMBER_DUPLICATED',
      message: getTextByCountry(countryCode, 'payPOPage_poNumber_textbox_errorMsg_duplicated')
    },
    PO_NUMBER_REQUIRED: {
      type: 'PO_NUMBER_REQUIRED',
      message: getTextByCountry(countryCode, 'payPOPage_poNumber_textbox_errorMsg_required')
    },
    PO_NUMBER_DOES_EXIST: {
      type: 'PO_NUMBER_DOES_EXIST',
      message: getTextByCountry(countryCode, 'payPOPage_poNumber_textbox_errorMsg_nonExistent')
    },
    PO_NUMBER_ALREADY_PAID: {
      type: 'PO_NUMBER_ALREADY_PAID',
      message: getTextByCountry(countryCode, 'payPOPage_poNumber_textbox_errorMsg_paid')
    },
    PO_NUMBER_INVALID_FORMAT: {
      type: 'PO_NUMBER_INVALID_FORMAT',
      message: getTextByCountry(countryCode, 'payPOPage_poNumber_textbox_errorMsg_invalidFormat')
    },
    PO_NUMBER_CONTAINS_SPECIAL_CHARACTER: {
      type: 'PO_NUMBER_CONTAINS_SPECIAL_CHARACTER',
      message: ErrorMessage.PO_NUMBER_CONTAINS_SPECIAL_CHARACTER
    },
    PO_NUMBER_WRONG_COUNTRY: {
      type: 'PO_NUMBER_WRONG_COUNTRY',
      message: getTextByCountry(countryCode, 'payPOPage_poNumber_textbox_errorMsg_wrongCountry')
    }
  }

  return listError[typeError]
}
