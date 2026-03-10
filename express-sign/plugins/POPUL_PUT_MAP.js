const User = require('../models/User')
const Article = require('../models/Article')
const Comment = require('../models/Comment')
const Column = require('../models/Column')

//PUT修改映射表
module.exports = {
  "Article": {
    "revisable": ["title", "cover", "content"],
    "authFiled": "author"
  },
  "User": {
    "revisable": ["password", "email", "nikname", "avatar"],
    "authFiled": "_id"
  },
  "Comment": {
    "revisable": ["content"],
    "authFiled": "uid"
  },
  "Column": {
    "revisable": ["name"],
    "authFiled": "uid"
  }
}