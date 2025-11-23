import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { ACCESS_TOKEN_KEY } from '@/constants'
import { snakeToCamel, camelToSnake } from '@/lib/utils'

import { API_CONFIG } from './config'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (
      config.data &&
      typeof config.data === 'object' &&
      !(config.data instanceof FormData) &&
      !(config.data instanceof File) &&
      config.headers?.['Content-Type'] !== 'multipart/form-data'
    ) {
      config.data = camelToSnake(config.data)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = snakeToCamel(response.data)
    }
    return response
  },
  (error: AxiosError) => {
    if (error.response?.data) {
      error.response.data = snakeToCamel(error.response.data)
    }

    return Promise.reject(error)
  }
)

export default apiClient
