import { router } from '../router/index'
import axios from 'axios'
import * as Authenticator from '@/repositories/Authenticator'

const Http = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL_API,
  headers: {
    'Content-type': 'application/json'
  }
})

Http.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('tka')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      delete Http.defaults.headers.common.Authorization
    }
    return config
  },

  error => Promise.reject(error)
)

Http.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response.status === 503) {
      if (router.currentRoute.path !== '/maintenance') {
        router.push('/maintenance')
      }
      return
    }
    const originalRequest = error.config
    if (error.response && error.response.data && error.response.data.errors && error.response.data.errors.length > 0) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        return Authenticator.generateAccessToken().then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axios(originalRequest)
        })
      }
    }
    throw error
  }
)

export {
  Http
}
