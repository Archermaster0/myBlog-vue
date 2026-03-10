const User = require('../models/User')
const Article = require('../models/Article')
const Comment = require('../models/Comment')
const Column = require('../models/Column')

//点击量映射表
module.exports = {
  "Article": {
    "queryAct": "findByIdAndUpdate",
    "options": function () {
      return {
        "$inc": {
          "hit_num": 1
        }
      }
    }
  }
}