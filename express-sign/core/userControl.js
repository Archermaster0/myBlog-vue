const {decrypt, encrypt} = require('../core/util/util')
const fs = require('fs').promises
const {userPath} = require('../config')
const {getUserStatusMsg} = require('./statusControl')


module.exports = {
  //添加用户
  async addUser (username, password) {
    // password 公钥加密
    let password = encrypt(password)
    //查看数据库是否存在同名用户
    let user = await this.getUserInfo(username)

    //如果用户名不存在
    if (user?.['tag'] === 'USER_NOF') {
      //设置userId
      let userId = await getUsersNum()
      //userId格式化
      userId = ('000000' + userId).substr(-6)
      await appendUser({user_id: userId, user_name: username, password})
      return {
        ...getUserStatusMsg('USER_ADD')
      }
    }
    //如果查询成功 即用户名已存在
    if (user?.['tag'] === 'USER_FOND') {
      return {
        ...getUserStatusMsg('USER_DR')
      }
    }
    //两种情况都没有成功 就是注册失败
    return {
      statusCode: user.statusCode,
      errMsg: '注册失败'
    }
  },

  //获取用户信息 查找是否有对应的用户信息
  async getUserInfo (username) {
    try {
      let users = await getUsers()
      //筛选username相同的用户信息
      let userInfo = users.find(item => item['user_name'].trim() === username.trim())

      //如果不存在相同的用户信息 返回没有找到
      if (!userInfo) {
        return {
          ...getUserStatusMsg('USER_NOF')
        }
      }
      //存在相同的用户信息就返回对应用户信息
      return {
        ...getUserStatusMsg('USER_FOND'),
        data: {
          ...userInfo //解构写法
        }
      }
    } catch (err) {
      console.error(err)
      return {
        ...getUserStatusMsg('USER_FERR'),
      }
    }
  },

  //验证token信息
  async verifyToken (username, userID) {
    try {
      let users = await getUsers()
      let userInfo = users.find(item => item['user_id'].trim() === userID.trim())

      //如果没有找到对应的userID 返回找不到
      if (!userInfo) {
        return {
          ...getUserStatusMsg('USER_NOF')
        }
      }

      //如果找到对应的userID  并且有对应的username 则验证通过
      if (userInfo['user_name'] === username) {
        return {
          ...getUserStatusMsg('USER_FOND'),
        }
      }
    } catch (err) {
      console.error(err)
      return {
        ...getUserStatusMsg('USER_FERR'),
      }
    }
  },

  //验证用户信息 账号密码
  async verifyUser (username, password) {
    let user = await this.getUserInfo(username)
    //如果查询不成功
    if (user?.['tag'] === 'USER_NOF') {
      return user
    }
    let {user_id, user_name, password} = user.data
    //验证密码  库中存储二次加密 和传输 一次加密 对比
    let isVerify = decrypt(decrypt(password.trim())) === decrypt(password.trim())

    //如果前端密码和数据库的密码相等 则登录成功
    if (isVerify) {
      return {
        ...getUserStatusMsg('USER_INN'),
        data: {
          user_id, user_name
        }
      }
    }
    return {
      ...getUserStatusMsg('PWD_WRONG'),
      data: {
        user_id, user_name
      }
    }
  }
}

//获取用户信息 并且将数据标准化为 数组形式
async function getUsers () {
  let users = await fs.readFile(userPath, 'utf8')
  users = JSON.parse(users)
  return users
}

//写入用户信息  将新的用户数据写入数据库 并且覆盖之前的
async function setUsers (users) {
  try {
    await fs.writeFile(userPath, JSON.stringify(users), 'utf8')
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

//添加用户信息 往用户数据里面添加新的用户数据
async function appendUser ({ user_id = false, user_name = false, password = false}) {
  let user = await getUsers()
  user.push({
    user_id, user_name, password
  })
  await setUsers(user)
  return true
}

//根据用户数据的数量 来设置用户的id数字
async function getUsersNum () {
  let users = await getUsers()
  return users?.length
}