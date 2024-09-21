import { Http } from './HttpCommon'

export async function create ({ payCountry, poList }) {
  try {
    const response = await Http.post('/v1/paymentTransactions', {
      payCountry,
      poList
    })
    return response.data
  } catch (error) {
    if (error.response) {
      throw error.response
    }
    throw error
  }
}

export async function retry (transactionUid) {
  try {
    const response = await Http.post('/v1/paymentTransactions/retry', { transactionUid })
    return response.data
  } catch (error) {
    if (error.response) {
      throw error.response
    }
    throw error
  }
}

export async function updateTransactionStatus (transactionUid, transactionStatus) {
  try {
    const response = await Http.post(
      `/v1/paymentTransactions/${transactionUid}/updateTransactionStatus`,
      { transactionStatus }
    )
    return response.data
  } catch (error) {
    if (error.response) {
      throw error.response
    }
    throw error
  }
}
