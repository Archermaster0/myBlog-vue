const mongoose = require('mongoose')
const {formatDate} = require('../core/util/util')

const schema = new mongoose.Schema({
  //分类名称
  name: {
    type: String,
    required: [true, "分类名称不能为空"]
  },
  //更新日期
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,
    get (val) {
      return formatDate(new Date(val), 'yy年MM月dd日 hh:mm:ss')
    }
  },
  //文章 id  文章集合
  aids: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Article"
  }],
  uid: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  }
})
//使用get处理数据 涉及到SchemaTypes包装过的数据(数据格式无法正常处理) 要开启toJSON方法 打开getters设置
schema.set('toJSON', {getters: true})

module.exports = mongoose.model("Column", schema)