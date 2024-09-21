import { uuid } from 'vue-uuid'

export const initRowData = (length, currency) => {
  return Array.from({ length }, () => initPO(currency))
}

export const initPO = (currency) => {
  return {
    no: uuid.v1(),
    poNumber: null,
    records: null,
    currency,
    amount: null,
    companyName: null,
    payStatus: null,
    error: null
  }
}
