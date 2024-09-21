import { ErrorMessage } from '@/repositories/ErrorMessage'

export const BL_NUMBER_ERRORS = {
  MaxLength16: {
    type: 'maxLength16',
    message: ErrorMessage.BL_NUMBER_LENGTH_16
  },
  Duplicated: {
    type: 'duplicated',
    message: ErrorMessage.BL_NUMBER_DUPLICATED
  },
  Required: {
    type: 'required',
    message: ErrorMessage.BL_NUMBER_REQUIRED
  },
  NotExists: {
    type: 'notExists',
    message: ErrorMessage.BL_NUMBER_NOT_EXISTS
  }
}

export const BL_AMOUNT_ERRORS = {
  Required: {
    type: 'required',
    message: ErrorMessage.BL_AMOUNT_REQUIRED
  },
  GreaterThan0: {
    type: 'greaterThan0',
    message: ErrorMessage.BL_AMOUNT_GREATER_THAN_0
  },
  AmountExceedsPaymentLimit: {
    type: 'amountExceedsPaymentLimit',
    message: ErrorMessage.BL_AMOUNT_EXCEEDS_PAYMENT_LIMIT
  }
}

export const BL_REMARK_ERRORS = {
  MaxLength2000: {
    type: 'maxLength2000',
    message: ErrorMessage.REMARK_MAX_LENGTH_2000
  }
}

const errors = { BL_NUMBER_ERRORS, BL_AMOUNT_ERRORS, BL_REMARK_ERRORS }
export default errors
