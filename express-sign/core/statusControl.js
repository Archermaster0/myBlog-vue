
//状态码双重映射表
const userTtC = {
  'USER_ADD': '200',
  'USER_FOND': '200',
  'USER_INN': '200',
  'USER_LOGIN': '200',
  'USER_TRIM': '4010',
  'USER_DR': '4011',
  'USER_NOF': '4012',
  'PWD_WRONG': '4013',
  'USER_FAILED': '4014',
  'USER_FERR': '4099',
}

const userCtM = {
  '200': '用户注册成功',
  '200': '用户查询成功',
  '200': '账号密码验证成功',
  '200': '登录成功',
  '4010': '用户名或密码不能为空',
  '4011': '用户已存在',
  '4012': '用户不存在',
  '4013': '密码错误',
  '4014': '登录失败',
  '4099': '用户查询错误',
}

module.exports = {
  //根据tag确定statusCode值  再确定errMsg值
  getUserStatusMsg(tag) {
    if (!tag) {
      return false
    }
    let statusCode = userTtC[tag]
    let errMsg = userCtM[statusCode]
    return {
      statusCode, errMsg, tag
    }
  }
}