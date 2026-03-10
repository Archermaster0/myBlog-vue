const inflection = require('inflection')

module.exports = options => {
  return async (req, res, next) => {
    //设置modelName模块名称的单复数和首字母大小写 
    let modelName = inflection.classify(req.params.resource)
    req.Model = require(`../models/${modelName}`)
    next()
  }
}


