const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Article = require('../models/Article')
const Comment = require('../models/Comment')
const Column = require('../models/Column')
const createError = require('http-errors')
const { pagination } = require('../core/util/util')
const assert = require('http-assert')
const POPUL_RELA_MAP = require('../plugins/POPUL_RELA_MAP')
const POPUL_POST_MAP = require('../plugins/POPUL_POST_MAP')
const POPUL_GET_MAP = require('../plugins/POPUL_GET_MAP')
const POPUL_PUT_MAP = require('../plugins/POPUL_PUT_MAP')
const RESOURCE_POST_MAP = require('../plugins/RESOURCE_POST_MAP')


//创建资源
router.post('/', async (req, res, next) => {
  try {
    let modelName = req.Model.modelName
    let body = req.body
    if (modelName in RESOURCE_POST_MAP) {
      body = RESOURCE_POST_MAP[modelName]['body'](body, req._id)
    }
    const result = await req.Model.create(body)

    if (modelName in POPUL_POST_MAP) {
      let item = POPUL_POST_MAP[modelName]
      let { _refId, _model, queryAct, options } = item
      //当前model的id
      let _id = result._id
      //添加地址的id
      let refId = result?.[_refId]
      assert(refId, 422, `${_refId} 必填`)
      await _model[queryAct](refId, options(_id))
    }
    res.send(200, {
      message: "提交成功",
      data: { id: result._id }
    })
  } catch (err) {
    next(err || createError(400, '添加失败'))
  }
})

//更新资源
router.put('/:id', async (req, res, next) => {
  let putData = req.body
  let modelName = req.Model.modelName
  let id = req.params.id //资源id
  let idLen = id.length
  let isPass = req.isPass //鉴权结果
  let userId = req._id //userID

  try {
    if (idLen !== 24) {
      res.send(200, {
        message: 'ID格式错误'
      })
      return
    }
    let { revisable, authFiled } = POPUL_PUT_MAP[modelName]
    //查找是否属于可修改范畴
    let isValidate = (modelName in POPUL_PUT_MAP) || isPass
    assert(isValidate, 400, '无权修改')
    //查找对应资源
    let data = await req.Model.findById(id)
    assert(data, 404, '资源ID不存在')
    //审查登录的用户id 和文章的用户id是否相等
    assert.equal(userId, data?.[authFiled], 400, '无权修改')

    //筛选出不明字段
    let updateData = Object.entries(putData).filter(([key, value]) => {
      return revisable.includes(key)
    })
    assert(updateData.length, 400, '修改失败')
    updateData = Object.fromEntries(updateData)
    //写入修改时间
    updateData['data'] = new Date().toISOString
    await req.Model.findByIdAndUpdate(id, putData)
    res.send(200, {
      message: '修改成功'
    })
  } catch (err) {
    next(err)
  }
})


//删除资源
router.delete('/:id', async (req, res) => {
  await req.Model.findByIdAndDelete(req.params.id)
  res.send({
    message: 'ok'
  })
})


//查询资源列表
router.get('/', async (req, res, next) => {
  let modelName = req.Model.modelName
  let sortMenu = -1 //控制内容倒叙还是升序
  let { options = {}, page = 1, size = 10, populate = {}, query = {}, dis = 8 } = req.query
  if (query.search) {
    let regExp = new RegExp(query.search, 'i')
    query = {
      $or: [
        { title: { $regex: regExp } },
        { content: { $regex: regExp } },
      ]
    }
  }
  try {
    if (modelName in POPUL_RELA_MAP) {
      populate = POPUL_RELA_MAP[modelName]
    }
    if (modelName === 'Column') {
      sortMenu = 1
    }
    //设置文章列表分页
    let result = await pagination({ model: req.Model, query, options, populate, size, page, dis, sortMenu })
    res.send(200, {
      message: 'ok',
      data: result
    })
  } catch (err) {
    next(createError(422, '请求错误'))
  }
})


//查询资源详情
router.get('/:id', async (req, res) => {
  let modelName = req.Model.modelName
  let _id = req.params.id
  try {
    let result = req.Model.findById(_id)

    if (modelName in POPUL_RELA_MAP) {
      let populates = POPUL_RELA_MAP[modelName]
      result = result.populate(populates)
      result = await result.exec()
      res.send(200, {
        message: '查询成功',
        data: result
      })
    }
    //通过ID查看资源的联动操作
    if (modelName in POPUL_GET_MAP) {
      let { queryAct, options } = POPUL_GET_MAP[modelName]
      await req.Model[queryAct](_id, options())
    }
    //判断查询users信息的情况
    if (modelName === 'User') {
      res.send(200, {
        message: '查询成功',
        data: result
      })
    }
  } catch (err) {
    console.log(err.message)
  }
})

module.exports = router


/*
  响应

  response

  成功:
     GET: 200 OK
     POST: 201 Created
     PUT: 200 OK
     PATCH: 200 OK
     DELETE: 204 No Content

    获取多条
    {
      message: 'ok',
      data:{
        count: 返回条目数量
        list:[ //请求列表
          {},{},{}
        ]
      }
    }
    单条数据
    {
      message: 'ok',
      data: {数据内容}
    }
    操作反馈 更新 添加
    {
       message: '用户注册成功|数据更新成功|文章提交成功',
    }

  错误
    statusCode
    400: 请求参数错误 请求路径错误
    401: jwt验证未通过 账号面错误
    403: 无权访问 权限不够
    404: 访问资源不存在 resource img file
    422: 用户不存在 密码错误 token过期

    {
      message:"响应错误文本"
    }
*/


/*
  setOptions
    new：bool-如果返回修改后的文档而不是原始文档，则为true。默认为false
    upsert：bool-创建对象（如果不存在）。默认为false。
    runValidators：如果为true，则对此命令运行更新验证程序。更新验证器根据模型的架构验证更新操作。
    setDefaultsOnInsert：如果upsert为true，则在创建新文档时，猫鼬将应用模型模式中指定的默认值。此选项仅在MongoDB> = 2.4上有效，因为它依赖于MongoDB的$setOnInsertoperator。
    sort：如果条件找到多个文档，请设置排序顺序以选择要更新的文档
    select：设置要返回的文档字段
    rawResult：如果为true，则返回MongoDB驱动程序的原始结果
    strict：覆盖此更新的架构的严格模式选项
 
*/

