const mongoose = require('mongoose')
const { uploadURL } = require('../config')
const { formatDate } = require('../core/util/util')
const schema = new mongoose.Schema({
  //文章标题
  title: {
    type: String,
    required: [true, "文章标题必填"],
    default: "默认标题" + Date.now
  },
  //封面图
  cover: {
    type: String, //URL
    default: `${uploadURL}article/cover.jpg`
  },
  //文章内容
  content: {
    type: String,
    required: [true, "文章内容必填"]
  },
  //更新时间
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,
    get(val) {
      return formatDate(new Date(val), 'yy年MM月dd日 hh:mm:ss')
    }
  },
  //点击量
  hit_num: {
    type: Number,
    default: 0
  },
  //评论数量
  comment_num: {
    type: Number,
    default: 0
  },
  //喜欢 点赞
  like_num: {
    type: Number,
    default: 0
  },
  //作者
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  },
  //评论集合
  comments: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Comment"
    }
  ],
  //分类
  column: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Column",
    required: true
  },
  likeUsers: {
    type: Array,
    default: []
  }
})

//使用get处理数据 涉及到SchemaTypes包装过的数据(数据格式无法正常处理) 要开启toJSON方法 打开getters设置
schema.set('toJSON', { getters: true })

module.exports = mongoose.model("Article", schema)