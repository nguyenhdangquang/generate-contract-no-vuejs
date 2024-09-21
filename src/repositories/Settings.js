import * as HttpCommon from './HttpCommon'

export async function findByCountryCode (country) {
  try {
    const response = await HttpCommon.Http.get(`/v1/settings/country/${country}`)
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data
    }

    throw error
  }
}
