import service from '@/api/common'
import encrypt from '@/util/encrypt'
import store from 'store'
import base from '@/config/base.config.js'
import API_LIST from '@/config/api.config'
import { ElNotification } from 'element-plus'

const { TOKEN_NAME } = base
export default async function Http({ type, data }) {
  if (!(type in API_LIST)) {
    throw new Error('API请求错误')
  }
  let { url, method, noMessage = false, rsaKey = false, rest = false, setToken = false } = API_LIST[type]
  try {
    method = method.toLowerCase()
    if (rest) {
      let restSymbol = url.match(/:(.*)$/)[1]
      url = url.replace(/:id/, data[restSymbol])
      url = url.replace(/:file/, data[restSymbol])
    }
    if (rsaKey && data[rsaKey]) {
      //加密
      data[rsaKey] = await encrypt(data[rsaKey])
    }
    //GET请求不能直接接受data数据 会将数据存在url中 需要用params来取data
    data = method === 'get' ? { params: data } : data
    let result = await service[method](url, data)
    if (setToken) {
      //获取令牌token和uid 并存到本地Local storage
      let token = result.token
      let uid = result.userId
      store.set('uid', uid)
      store.set(TOKEN_NAME, token)
    }
    return result
  } catch (error) {
    if (error.response) {
      let message = error.response.data.message
      if (!noMessage) {
        //使用插件 展示错误信息
        ElNotification({
          title: '错误',
          message,
          type: 'error',
        })
      }
    }
    return Promise.reject(error)
  }
}