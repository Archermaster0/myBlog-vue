
const { encrypt, decrypt, generateKeys } = require('../core/util/util')
const fs = require('fs').promises //fs 代理 用于异步
const fsSync = require('fs')
const { pubKeyPath, priKeyPath } = require('../config') //通过项目设置项模块获取公钥和私钥的文件地址

module.exports = {
  //获取公钥  同步方法
  getPublicKeySync() {
    return fsSync.readFileSync(pubKeyPath, 'utf8')
  },
  //获取公钥 如果没有找到公钥就创建一次密钥再获取
  async getPublicKey() {
    let key
    try {
      key = await fs.readFile(pubKeyPath, 'utf8')
    } catch (err) {
      generateKeys()
      key = await fs.readFile(pubKeyPath, 'utf8')
    }
    return key
  },
  //获取私钥 如果没有找到私钥就创建一次密钥再获取
  async getPrivateKey() {
    let key
    try {
      key = await fs.readFile(priKeyPath, 'utf8')
    } catch (err) {
      generateKeys()
      key = await fs.readFile(priKeyPath, 'utf8')
    }
    return key
  }
}
