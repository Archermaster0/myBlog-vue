const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const { uploadPath, uploadURL, maxFileSize } = require('../config')
const User = require('../models/User')
const Article = require('../models/Article')
const createError = require('http-errors')
const multer = require('multer')
const assert = require('http-assert')

const FILE_TYPE = {
  'user': 'user',
  'article': 'article',
  'album': 'album'
}

const storage = multer.diskStorage({
  //设置存储位置
  destination(req, res, cb) {
    let fileType = FILE_TYPE[req.params['classify'].trim()] ?? "other"
    const filePath = path.join(uploadPath, fileType)
    fs.existsSync(filePath) || fs.mkdirSync(filePath)
    cb(null, filePath)
  },
  //设置文件名
  filename(req, file, cb) {
    const { ext, name } = path.parse(file.originalname)
    cb(null, name + '_' + Date.now() + ext)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize
  }
})

router.post('/:classify', upload.any(), async (req, res, next) => {
  try {
    let fileType = FILE_TYPE[req.params['classify'].trim()] ?? ""
    console.log(req.user)
    assert(fileType, 422, '文件上传分类不正确')
    let uid = req.user?._id
    if (fileType === 'user') {
      assert(uid, 422, '用户头像必须指定UID')
    }

    let fileURLS = req.files.map(item => {
      let { destination, filename } = item
      return path.join(uploadURL, path.parse(destination).name, filename).replace(/\\/g, '/').replace('http:/', 'http://')
    })
    //这里主要用于头像上传的返回信息
    let resultData = {
      message: "上传成功",
      data: {
        fileURL: fileURLS[0]
      }
    }
    //这里主要用于文章上传多个图片返回信息
    if (fileType === 'article') {
      console.log(fileURLS)
      resultData = {
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
          "url": fileURLS[0], // 图片 src ，必须
        }
      }
    }
    res.send(200, resultData)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

module.exports = router


