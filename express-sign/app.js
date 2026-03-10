const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const { mongoose } = require('./plugins/db')
const { maxFileSize } = require('./config')
const expressJwt = require('express-jwt')
const { getPublicKeySync } = require('./core/rsaControl')
const User = require('./models/User')

// require('./socket') //开启socket会话

// const indexRouter = require('./routes/index');

//中间件 nameMiddleware
const resourceMiddleware = require('./middleware/resource')

//路由  nameRoute
const busRoute = require('./routes/bus')
const adminRoute = require('./routes/admin');
const getPubKeyRoute = require('./routes/getPubKey');
const uploadRoute = require('./routes/upload');
const searchRoute = require('./routes/search');
const artLikesRoute = require('./routes/artLikes');
const userRoute = require('./routes/user')
const albumRoute = require('./routes/album')

const app = express();

//设置跨域请求
app.use(cors({
  "origin": true, //true 设置为 req.origin.url
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //容许跨域的请求方式
  "allowedHeaders": "x-requested-with,Authorization,token, content-type", //跨域请求头
  "preflightContinue": false, // 是否通过next() 传递options请求 给后续中间件 
  "maxAge": 1728000, //options预验结果缓存时间 20天
  "credentials": true, //携带cookie跨域
  "optionsSuccessStatus": 200 //options 请求返回状态码
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))

// app.use('/user', indexRouter)
// app.use('/register', registerRouter)
// app.use('/login', loginRouter)

app.use(expressJwt({
  secret: getPublicKeySync(),//解密密钥
  algorithms: ["RS256"], //6.0.0以上版本必须设置解密算法 
  isRevoked: async (req, payload, next) => {
    //获取token payload内容
    let { _id } = payload
    req._id = _id //用户id
    req.isPass = true
    try {
      //审查用户存不存在
      let result = await User.findById(_id)
      if (!result) {
        req.isPass = false
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}).unless({
  path: [
    { url: '/api/rest/comments/', methods: ['POST'] },
    { url: /\/api\/rest/, methods: ['GET'] },
    { url: '/api/rest/keys', methods: ['GET'] },
    { url: '/admin/login' },
    { url: '/admin/register' },
    { url: '/keys' },
    { url: '/articles/search' },
    { url: '/articles/likes' },
    { url: '/album' },
    { url: '/upload/album' },
  ]
}))


//资源路由
app.use('/api/rest/:resource', resourceMiddleware(), busRoute)

//登录/注册
app.use('/admin', adminRoute)
app.use('/index', async (req, res, next) => {
  if (req.isPass) {
    res.send(200, {
      message: 'OK'
    })
  } else {
    res.send(401, {
      message: '请先登录'
    })
  }
})
app.use('/user', userRoute)
app.use('/album', albumRoute)
//获取公钥
app.use('/keys', getPubKeyRoute)
//文件上传
app.use('/upload', uploadRoute)
//文章搜索
// app.use('/articles/search', searchRoute)
//文章点赞
app.use('/articles/likes', artLikesRoute)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
});

const ERROR_CODE_MAP = {
  'LIMIT_FILE_SIZE': `文件大小不得超过 ${maxFileSize} bytes`
}

const ERROR_STATUS_MAP = {
  '401': '无权限操作,请先登录'
}

const QUE_MAP = {
  "username": "用户名",
  "password": "密码",
  "email": "邮箱",
  "nikname": "昵称",
  "avatar": "头像"
}

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  //查重
  if (err.message.indexOf('duplicate key error') !== -1) {
    let repeatKey = Object.entries(err.keyPattern).map(([key, value]) => {
      return ` ${QUE_MAP[key]} 重复 `
    })[0]
    err.status = 422
    err.message = repeatKey
  }


  //assert mongoose 会自创建errors来装报错信息
  if (err.errors) {
    let paramErrors = Object.entries(err.errors).map(([key, value]) => {
      return value.message
    }).join(',')
    err.status = 422
    err.message = paramErrors
  }

  if (err.code in ERROR_CODE_MAP) {
    err.status = 422
    err.message = ERROR_CODE_MAP[err.code]
  }

  //鉴权报错处理
  if (err.status in ERROR_STATUS_MAP) {
    err.message = ERROR_STATUS_MAP[err.status]
  }
  // render the error page
  res.status(err.status || 500).send({
    code: err.status,
    message: err.message
  });
  // res.render('error');
});

module.exports = app;
