const mongoose = require('mongoose')
const {formatDate} = require('../core/util/util')

const schema = new mongoose.Schema({
  //评论内容
  content: {
    type: String,
    required: [true, "评论内容不能为空"]
  },
  //更新日期
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,
    get (val) {
      return formatDate(new Date(val), 'yy年MM月dd日 hh:mm:ss')
    }
  },
  //评论者 id
  uid: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  },
  //文章 id
  aid: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Article"
  }
})

//使用get处理数据 涉及到SchemaTypes包装过的数据(数据格式无法正常处理) 要开启toJSON方法 打开getters设置
schema.set('toJSON', {getters: true})

module.exports = mongoose.model("Comment", schema)