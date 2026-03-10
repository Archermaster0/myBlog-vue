const express = require('express')
const router = express.Router()
const Article = require('../models/Article')
const User = require('../models/User')

//点赞文章
router.post('/:id', async (req, res, next) => {
  console.log(req.params.id)
  let aid = req.params.id //文章ID
  let uid = req._id //用户ID
  let isLike = req.body.isLike
  try {
    let result
    let likes
    if (!isLike) {
      result = await Article.update({ _id: aid }, { $pull: { likeUsers: uid } })
      likes = result.likeUsers?.length || 0
      await User.update({ _id: uid }, { $pull: { articleLikes: aid } })
      res.send(200, {
        message: '取消点赞成功',
        data: { likes }
      })
      return
    }
    //文章点赞数量加1 点赞的作者集合 添加对应的uid
    result = await Article.findByIdAndUpdate(aid, { $addToSet: { likeUsers: uid } })
    likes = result.likeUsers?.length + 1
    //作者喜欢的文章集合 添加对应的aid
    await User.findByIdAndUpdate(uid, { $addToSet: { articleLikes: aid } })
    res.send(200, {
      message: '点赞成功',
      data: { likes }
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router