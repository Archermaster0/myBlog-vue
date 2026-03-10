const express = require('express')
const router = express.Router()
const Key = require('../models/Key')

//GET getPubKey  获取密钥
router.get('/', async function (req, res, next) {
  let result = await Key.findOne()
  res.send(200, {
    statusCode: 200,
    message: '成功获取密钥',
    data: {
      pubKey: result.content
    }
  })
})

module.exports = router