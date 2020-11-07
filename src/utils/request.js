// 请求模块
import axios from 'axios'
import store from '@/store'
import JSONBigint from 'json-bigint'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 自定义后端返回的原始数据
  transformResponse: [function (data) {
    try {
      return JSONBigint.parse(data)
    } catch (err) {
      return data
    }
  }]
})
// 请求拦截
request.interceptors.request.use(function (config) {
  // 发起请求进入
  // 配置 请求头
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // 必须返回 config 请求才会继续执行
  return config
}, function (error) {
  // 请求发起之前，出错进入
  return Promise.reject(error)
})
export default request
