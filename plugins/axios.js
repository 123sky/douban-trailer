import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.baseUrl
})

axiosInstance.interceptors.request.use(
  function(config) {
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  function(response) {
    return response.data
  },
  function(error) {
    return Promise.reject(error)
  }
)

export default axiosInstance
