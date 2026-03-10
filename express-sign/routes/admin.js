
const express = require('express')
const router = express.Router()
const { decrypt } = require('../core/util/util')
const assert = require('http-assert') //断言  中间件 返回错误信息 密码校验
const User = require('../models/User');
const {sendToken} = require('../core/sendToken') //签发token


const CLASSIFY = {
  'login': "login",
  'register': 'register'
}

const MESSAGE_MAP = {
  'login': "登录成功",
  'register': '注册成功'
}

//登录成功之后签发token令牌
router.post('/:classify', async function (req, res, next) {
  let {username, password} = req.body
  let {classify} = req.params
  let user
  let isClassPass = classify in CLASSIFY
  assert(isClassPass, 422, '无效请求')

  try {
    if (!username || username?.trim()?.length === 0 || !password || password?.trim()?.length === 0) {
      assert(false, 422, '账号密码必填') //返回状态码和错误信息
    }
    if (classify === 'login') {
      user = await User.findOne({username}).select('+password')
      //校验用户是否存在
      assert(user, 422, '用户不存在')
      //校验密码
      assert.equal(decrypt(password), decrypt(decrypt(user.password)), 422, '密码错误')
    }
    if (classify === 'register') {
      //创建用户
      user = await User.create(req.body)
    }
    
    //生成token
    let token = await sendToken(user)
    res.send(200, {
      message: MESSAGE_MAP[classify],
      data: {
        userId: user._id,
        token: token
      }
    })
  } catch (err) {
    next(err)
  }

})

module.exports = router