
const express = require('express');
const router = express.Router();
const userControl = require('../core/userControl')
const { getUserStatusMsg } = require('../core/statusControl')
const { getPrivateKey, getPublicKey, getPublicKeySync } = require('../core/rsaControl')
const jwt = require('jsonwebtoken') //token生成包  JWT
const expressJwt = require('express-jwt') //token验证中间件 JWT
const createError = require('http-errors');

/* 解密令牌 由token令牌登录 */
router.post('/', expressJwt({
  secret: getPublicKeySync(),//解密密钥
  algorithms: ["RS256"], //6.0.0以上版本必须设置解密算法 
  isRevoked: function (req, payload, next) {
    //获取token payload内容
    let {user_name, user_id} = payload
    req.username = user_name
    req.userID = user_id
    userControl.verifyToken(user_name, user_id).then(result => {
      req.isPass = false
      if (result.statusCode === getUserStatusMsg('USER_FOND')['statusCode']) {
        req.isPass = true
      }
      next()
    })
  }
}), async function (req, res, nest) {
  if (req.isPass) {
    res.send(200, {
      ...getUserStatusMsg('USER_LOGIN'),
    })
  } else {
    res.send(200, {
      ...getUserStatusMsg('USER_FAILED'),
    })
  }

});

module.exports = router;
