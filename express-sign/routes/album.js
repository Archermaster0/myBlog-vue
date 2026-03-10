const express = require('express')
const router = express.Router()
//引用文件系统模块
const fs = require("fs")
const path = require("path")
const { uploadPath, uploadURL } = require('../config')
let imgPath = uploadPath + '/album/'

function readFileList(imgPath) {
  let files = fs.readdirSync(imgPath)
  let filesList = []
  files.forEach(itme => {
    filesList.push({ url: path.join(uploadURL, 'album/', itme).replace(/\\/g, '/').replace('http:/', 'http://') })
  })
  return filesList
}

// //删除资源
router.delete('/:file', async (req, res, next) => {
  let filePath = (imgPath + req.params.file).replace(/\\/g, '/')
  fs.unlink(filePath, err => {
    if (err) {
      console.error('图片删除失败', err);
    } else {
      res.send({
        message: '图片删除成功'
      })
    }
  })
})


//查询用户信息
router.get('/', async (req, res, next) => {
  try {
    let imageList = await readFileList(imgPath)
    res.send(200, {
      message: '查询成功',
      data: imageList
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router