import store from "store"
import forge from 'node-forge'
import service from "@/api/common"
import base from '@/config/base.config.js'

const { PUBKEY_NAME } = base

export default
  /**
   *@function encrypt
   *@param {String} value
   *@return {String} 加密后的密码
   *@description: 加密
   *@date: 2024-10-11 14:20:07
  */
  async function encrypt(value) {
  //在本地Local storage存储中获取公钥
  let key = store.get(PUBKEY_NAME)
  try {
    //如果公钥不存在 就设置一个公钥
    if (!key || key === 'undefined') {
      //获取公钥
      let result = await service.get('/keys')
      key = result.pubKey
      //公钥格式标准化
      key = key.replace(/\. +/g, '')
      key = key.replace(/[\r\n]/g, '')
      //将密钥存入本地Local storage
      store.set(PUBKEY_NAME, key)
    }
    //将公钥实例化
    const publicObj = forge.pki.publicKeyFromPem(key)
    //对公钥进行rsa加密
    let bytes = publicObj.encrypt(value, 'RSA-OAEP')
    return forge.util.encode64(bytes)
  } catch (err) {
    console.log(err)
  }
}