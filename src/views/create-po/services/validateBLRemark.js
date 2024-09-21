import { BL_REMARK_ERRORS } from '../utils/errors'

export const validateBLRemark = (remark) => {
  let error = null

  if (remark && remark.length === 2001) {
    error = BL_REMARK_ERRORS.MaxLength2000
  }

  return error
}
