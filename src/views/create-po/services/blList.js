import { uuid } from 'vue-uuid'

export const initRowData = (row, currencyCode) => {
  const blList = []
  for (let i = 0; i < row; i++) {
    blList.push({
      no: i,
      number: '',
      currency: currencyCode,
      amount: '',
      remark: '',
      error: '',
      numberError: null,
      amountError: null,
      remarkError: null
    })
  }
  return blList
}

export const initBL = (code) => {
  return {
    no: uuid.v1(),
    number: '',
    currency: code,
    amount: '',
    remark: '',
    numberError: null,
    amountError: null,
    remarkError: null
  }
}
