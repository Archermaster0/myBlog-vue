const User = require('../models/User')
const Article = require('../models/Article')
const Comment = require('../models/Comment')
const Column = require('../models/Column')

//文章 文章分类 POST映射表
module.exports = {
  "Article": {
    "_refId": "column",
    "_model": Column,
    "queryAct": "findByIdAndUpdate",
    "options": function (_id) {
      return {
        "$push": {
          "aids": _id
        }
      }
    }
  },
  "Comment": {
    "_refId": "aid",
    "_model": Article,
    "queryAct": "findByIdAndUpdate",
    "options": function (_id) {
      return {
        "$push": {
          "comments": _id
        },
        "$inc": {
          "comment_num": 1
        }
      }
    }
  }
}