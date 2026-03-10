const app = require('./app');
const { createServer } = require("http");
const { Server } = require("socket.io");
let { formatDate } = require('./core/util/util')

const httpServer = createServer(app);
const io = new Server(httpServer, { transports: ['websocket'] });

let users = {}

io.on("connection", (socket) => {
  console.log('连接已经建立', `id: ${socket.id}`)

  //客户端 用户上线
  socket.on('online', ({ nikname, uid }) => {
    //如果用户已经存在 让已存在的用户断开连接
    if (users[uid]) {
      users[uid].socket.disconnect()
    }
    //重新存储用户信息 开启新的会话
    users[uid] = { nikname, uid, socket: socket }
  })

  //客户端用户进入聊天室
  socket.on('enterChat', ({ nikname, uid = createTempId() }) => {
    //向所有用户广播 用户进入聊天室
    io.sockets.emit('logged', nikname)
    //如果用户已经存在 就什么都不做
    if (users[uid]) {
      socket.uid = uid
      socket.isVisitor = false //不是游客
      return
    }
    //用户不存在时 将用户存入库中
    users[uid] = { nikname, uid, socket: socket }

    //将uid存入socket实例
    socket.uid = uid
    socket.isVisitor = true //添加游客属性
  })

  //客户端用户离开聊天室
  socket.on('leaveChat', () => {
    let uid = socket.uid
    io.sockets.emit('logout', users[uid]?.nikname)
    //如果是游客离开 断开连接 清除用户信息
    if (socket.isVisitor) {
      socket.disconnect()
    }

  })

  //客户端断开连接
  socket.on('disconnect', () => {
    console.log('断开连接')
    let uid = socket.uid
    delete users[uid]
  })

  //客户端用户发送消息
  socket.on('send', (msg) => {
    let nikname = users[socket['uid']].nikname
    socket.broadcast.emit('chat', ({ nikname, msg, time: formatDate() }))
  })
});

function createTempId() {
  return Date.now() + Math.random().toString(36).slice(-6)
}

httpServer.listen(8888, () => {
  console.log('websocket聊天室开启 端口8888')
});

module.exports = httpServer