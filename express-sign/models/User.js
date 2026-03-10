const mongoose = require('mongoose')
const { encrypt, decrypt } = require('../core/util/util')

const schema = new mongoose.Schema({
  //用户名
  username: {
    type: String,
    required: [true, "用户名必填"],
    validate: {
      validator(val) {
        return /^(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,12}$/.test(val)
      },
      message: "用户名必须为 数字+字母 6-12位"
    }
  },
  //密码
  password: {
    type: String, //URL
    select: false,
    required: [true, "密码必填"],
    validate: {
      validator(val) {
        return val !== '密码格式不正确'
      },
      message: "密码必须为 数字+密码(大小写) 8-12位"
    },
    set(val) {
      let isValidate = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!.#*?&]{8,12}$/.test(decrypt(val))
      if (isValidate) {
        //触发器  setter  写入password时触发  写入数据  => encrypt(源数据) 二次加密
        return encrypt(val)
      }
      return '密码格式不正确'
    }
  },
  //邮箱
  email: {
    type: String,
    required: true,
    validate: {
      validator(val) {
        return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(val)
      },
      message: "请输入合法邮箱地址"
    }
  },
  //头像
  avatar: {
    type: String, //URL
    default: "http://127.0.0.1:3000/images/default-avatar.png"
  },
  //昵称
  nikname: {
    type: String,
    validate: {
      validator: function (val) {
        return /^[0-9a-zA-Z\u0391-\uFFE5]{1,8}$/.test(val)
      },
      message: "昵称可包含 数字/英文/汉字 1-8位"
    },
    default: "未命名" + ~~(Math.random() * 999)
  },
  //签名
  signature: {
    type: String,
    default: '这个人很懒, 什么都没有写^_^'
  },
  articleLikes: {
    type: Array,
    default: []
  }
})

module.exports = mongoose.model("User", schema)