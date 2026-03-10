const express = require('express')
const router = express.Router()
const Article = require('../models/Article')
const {pagination} = require('../core/util/util')

/*
  文章搜索 search API

  title body

  http://127.0.0.1:3000/search?q=你好
*/

router.get('/', async (req, res, next) => {
  let {q = ''} = req.query
  let regExp = new RegExp(q, 'i')
  try {
    let options = 'title _id', 
    size = 100, 
    page = 1, 
    dis = 8,
    query = {
      $or: [
        {title: { $regex: regExp }},
        {content: { $regex: regExp }}
      ]
    }
    let result = await pagination({model: Article, query, options, size, page, dis})
    let listLen = result.list.length
    if (listLen === 0) {
      res.send(200, {
        message: '没有查询到相关内容',
        data: result
      })
      return
    }
    res.send(200, {
      message: '查询成功',
      data: result
    })
  } catch (err) {
    next(err)
  }

})

module.exports = router