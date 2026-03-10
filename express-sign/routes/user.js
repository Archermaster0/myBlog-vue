const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Article = require('../models/Article')
const Column = require('../models/Column')
const createError = require('http-errors')
const { pagination } = require('../core/util/util')
const assert = require('http-assert')
const POPUL_RELA_MAP = require('../plugins/POPUL_RELA_MAP')
const POPUL_POST_MAP = require('../plugins/POPUL_POST_MAP')
const POPUL_GET_MAP = require('../plugins/POPUL_GET_MAP')
const POPUL_PUT_MAP = require('../plugins/POPUL_PUT_MAP')
const RESOURCE_POST_MAP = require('../plugins/RESOURCE_POST_MAP')

//更新信息
router.put('/', async (req, res, next) => {
  let putData = req.body
  let isPass = req.isPass //鉴权结果
  let userId = req._id //userID
  try {
    assert(isPass, 400, '无权修改')
    //查找并修改对应资源
    let result = await User.findByIdAndUpdate(userId, putData)
    res.send(200, {
      message: '修改成功'
    })
  } catch (err) {
    next(err)
  }
})


// //删除资源
// router.delete('/:id', async (req, res) => {
//   await req.Model.findByIdAndDelete(req.params.id)
//   res.send({
//     message: 'ok'
//   })
// })


//查询用户信息
router.get('/', async (req, res, next) => {
  let _id = req._id
  try {
    let userResult = await User.findById(_id)
    let articleCount = await Article.find({ author: _id }).count()
    let columnCount = await Column.find({ uid: _id }).count()
    userResult = userResult.toJSON()
    userResult.articleCount = articleCount
    userResult.columnCount = columnCount
    res.send(200, {
      message: '查询成功',
      data: userResult
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
