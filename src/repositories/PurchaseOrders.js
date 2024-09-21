import { Http } from './HttpCommon'

export async function create ({
  companyName,
  emailAddress,
  contactNumber,
  blInvList,
  areaCode,
  countryCode
}) {
  try {
    const response = await Http.post('/v1/purchaseOrders', {
      companyName,
      emailAddress,
      contactNumber,
      blInvList,
      areaCode,
      countryCode
    })
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data
    }

    throw error
  }
}

export async function getOne (poUid, {
  countryCode
}) {
  try {
    const response = await Http.get(`/v1/purchaseOrders/${poUid}`, {
      params: {
        countryCode,
        timestamp: `${new Date().getTime()}`
      }
    })

    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data
    }

    throw error
  }
}
