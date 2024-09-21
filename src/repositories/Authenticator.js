import * as HttpCommon from './HttpCommon'
import StorageHelper from '@/utils/storageHelper'
export async function generateAccessToken () {
  try {
    const response = await HttpCommon.Http.post('/v1/authentication/generateAccessToken', {}, {
      headers: {
        'x-api-key': process.env.VUE_APP_EP_API_KEY
      }
    })
    if (response && response.data) {
      StorageHelper.setItem('tka', response.data.accessToken)
      return response.data.accessToken
    }
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data
    }
    throw error
  }
}
