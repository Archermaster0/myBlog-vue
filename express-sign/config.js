//项目设置项
const path = require('path')
module.exports = {
  host: '127.0.0.1',
  root: process.cwd(),
  port: 3000,
  keyPath: path.join(process.cwd(), '/auth'), //密钥目录
  pubKeyPath: path.join(process.cwd(), '/auth/public.cer'), //公钥文件目录
  priKeyPath: path.join(process.cwd(), '/auth/private.cer'), //密钥文件目录
  userPath: path.join(process.cwd(), '/user/user.json'), //用户数据存储文件
  uploadPath: path.join(process.cwd(), '/uploads'), //文件上传存储文件夹路径
  uploadURL: 'http://127.0.0.1:3000/', //访问文件URL地址host
  maxFileSize: 10240000  //设置最大上传数据大小
}