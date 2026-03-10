const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  //公钥
  content: {
    type: String,
    required: [true, "公钥内容不能为空"]
  },
  //更新日期
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Key", schema)