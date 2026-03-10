
const NodeRSA = require('node-rsa')
const path = require('path')
const fs = require('fs')
const { priKeyPath, pubKeyPath } = require('../../config');
const cerPath = path.join(process.cwd(), './auth')
const mongoPage = require('mongoose-sex-page'); //分页设置  mongoose插件
const qs = require('qs')

//创建密钥  只运行一次即可
function generateKeys() {
  //实例化 b设置密钥位 bit越大越安全  256 , 512, 1024 - 4096
  const newKey = new NodeRSA({ b: 2048 })

  //设置密钥模式 
  newKey.setOptions({ encryptionScheme: 'pkcs1' })

  //设置公钥
  let public_key = newKey.exportKey('pkcs1-public')

  //设置私钥
  let private_key = newKey.exportKey('pkcs1-private')

  //写入公钥 私钥 cer文件
  fs.writeFileSync(priKeyPath, private_key);
  fs.writeFileSync(pubKeyPath, public_key);
}

//设置加密
function encrypt(plain) {
  //读取密钥 公钥
  let public_key = fs.readFileSync(pubKeyPath, 'utf8')

  //公钥实例化
  const nodersa = new NodeRSA(public_key)

  //设置密钥 scheme 密钥模式 现版本不需要设置
  // nodersa.setOptions({encryptionScheme: 'pkcs1'})

  //调用加密方法 plain是需要加密的明文 加密生成的格式
  const encrypted = nodersa.encrypt(plain, 'base64')
  return encrypted
}

//设置解密
function decrypt(cipher) {
  //获取私钥
  let private_key = fs.readFileSync(priKeyPath, 'utf8')

  //私钥实例化
  let prikey = new NodeRSA(private_key)

  //设置 模式  现版本不需要设置
  // prikey.setOptions({ encryptionScheme: 'pkcs1' })

  //decrypt(解密密文, 解密后格式)
  return prikey.decrypt(cipher, 'utf8')
}

/**
 *@function pagination
 *@param {Object} {model, query, options, size, page, dis}
 *@return {Object} {count, page, size, total, list, pages, display}
 *@description: 分页设置
 *@date: 2024-09-20 17:44:00
*/
async function pagination({ model, query, options, populate = {}, size, page, dis, sortMenu }) {
  if (typeof query === 'string') {
    query = QS.parse(query)
  }
  //第三方插件设置分页参数
  let result = await mongoPage(model).find(query).sort({ '_id': sortMenu }).select(options).populate(populate).size(size).page(page).display(dis).exec()
  let { total, records: list, pages, display } = result
  //每页数据数量
  let count = list.length
  return { count, page, size, total, list, pages, display }
}

/**
 *@function toDouble
 *@param {Number} num
 *@return {String} 
 *@description: 数字补零
 *@date: 2024-10-08 14:21:17
*/
function toDouble(num) {
  return String(num)[1] && String(num) || '0' + num;
}

/**
 *@function formatDate
 *@param {String} date format
 *@return {String} 
 *@description: 日期格式格式化
 *@date: 2024-10-08 14:12:35
*/
function formatDate(date = new Date(), format = "yyyy-MM-dd hh:mm:ss") {

  let regMap = {
    'y': date.getFullYear(),
    'M': toDouble(date.getMonth() + 1),
    'd': toDouble(date.getDate()),
    'h': toDouble(date.getHours()),
    'm': toDouble(date.getMinutes()),
    's': toDouble(date.getSeconds())
  }

  //逻辑(正则替换 对应位置替换对应值) 数据(日期验证字符 对应值) 分离
  return Object.entries(regMap).reduce((acc, [reg, value]) => {
    return acc.replace(new RegExp(`${reg}+`, 'g'), value);
  }, format);
}

module.exports = {
  encrypt, decrypt, generateKeys, pagination, formatDate, toDouble
}