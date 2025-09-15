import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 5000,
})

api.interceptors.request.use(
  config => {
    if (process.env.NODE_ENV == "development")
      console.log(`[API] ${config.method?.toUpperCase()} → ${config.url}`)
    return config
  },
  error => {
    if (error instanceof Error) return Promise.reject(error)
    return Promise.reject(new Error(error?.message || 'Error en request'))
  }
)

api.interceptors.response.use(
  response => response,
  error => {
    if (process.env.NODE_ENV == "development")
      console.error('[API ERROR]', error.response?.data || error.message)

    if (error instanceof Error) return Promise.reject(error)

    const wrappedError = new Error(error?.message || 'Error en la respuesta')
    wrappedError.cause = error
    return Promise.reject(wrappedError)
  }
)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
