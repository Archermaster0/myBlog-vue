import axios from "axios"
import store from "store"
import base from '@/config/base.config.js'

const { TIMEOUT, TOKEN_NAME } = base
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,//这个地址使用vite的环境变量
  timeout: TIMEOUT
})

// 添加请求拦截器
service.interceptors.request.use(async (config) => {
  let token = store.get(TOKEN_NAME)
  //只要token存在就给请求都带上token
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error);
})

// 添加响应拦截器
service.interceptors.response.use((response) => {
  // 对响应数据做点什么 剥离最外层
  let result = response.data
  //输出的时候再剥离一层数据
  return result?.data
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error);
})

export default service