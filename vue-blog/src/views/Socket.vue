<template>
  <div class="blog-chat">
    <div class="blog-chat--wrap">
      <div class="blog-chat--item" v-for="(chat, idx) in chatList" :key="idx">
        <div class="blog-chat--content" v-if="chat.isChat" :class="chat.direction">
          <span class="blog-chat--nikname">{{ chat.nikname }}</span>
          <div class="blog-chat--mssage">
            <span class="blog-chat--time">{{ chat.time }}</span>
            <p class="blog-chat--msg">{{ chat.msg }}</p>
          </div>
        </div>
        <div class="blog-chat--notify" v-if="chat.isNotify">
          <p class="blog-notify--time">{{ chat.time }}</p>
          <p class="blog-notify--msg">{{ chat.msg }}</p>
        </div>
      </div>
    </div>
    <div class="blog-chat--buttom">
      <el-input v-model="sendMsg" placeholder="请输入内容" @keydown.native.enter="sendChat"></el-input>
      <el-button type="primary" @click="sendChat">发送消息</el-button>
    </div>
    <el-dialog title="欢迎聊天" v-model="dialogVisible" width="30%" align-center :before-close="handleClose">
      <el-form-item label="昵称" required>
        <el-input v-model="nikname" />
      </el-form-item>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="enterChat">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import formatDate from '@/util/formatDate'
import { io } from 'socket.io-client'
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useBlogStore } from '@/stores/blog_store';
import router from '@/router';
import { ElNotification } from 'element-plus';

let blogStore = useBlogStore()
const sendMsg = ref('')
const nikname = ref('')
const uid = ref('')
const chatList = ref([])
const dialogVisible = ref(true)//游客登录框展示控制
let socket = null

onBeforeMount(async () => {
  if (blogStore.socket) {
    socket = blogStore.socket
    getUserInfo()
    socket.emit('enterChat', { nikname: nikname.value, uid: uid.value })
    dialogVisible.value = false
  } else {
    socket = io(import.meta.env.VITE_USER_CHAT_PATH, { transports: ['websocket'] })
    console.log('游客进入聊天')
  }

  socket.on('chat', ({ nikname, msg, time }) => {
    serverChat({ nikname, msg, time })
  })

  //监听服务端的登入聊天室事件
  socket.on('logged', (nikname) => {
    serverLog({ nikname, isLogin: true })
  })

  //监听服务端的登出聊天室事件
  socket.on('logout', (nikname) => {
    serverLog({ nikname, isLogin: false })
  })
})

//组件实例被卸载之前
onBeforeUnmount(() => {
  //关闭socket
  socket.emit('leaveChat')
})

//游客输入昵称 进入聊天
function enterChat() {
  if (nikname.value.trim().length === 0 || !nikname.value) {
    ElNotification({
      title: '错误',
      message: '昵称必填',
      type: 'error',
    })
    return
  }
  socket.emit('enterChat', { nikname: nikname.value })
  dialogVisible.value = false
}

//获取用户信息
function getUserInfo() {
  nikname.value = blogStore.gttersUserInfo.nikname
  uid.value = blogStore.gttersUserInfo._id
}

//发送聊天信息
function sendChat() {
  addChat({ msg: sendMsg.value, nikname: nikname.value, isMe: true, isChat: true })
  socket.emit("send", sendMsg.value)
  sendMsg.value = ''
}

//添加聊天信息到聊天框
function addChat({ msg = '', nikname = '', time = formatDate(), isMe = false, isNotify = false, isChat = false }) {
  //默认内容方向在左边
  let direction = 'left'
  if (isMe) direction = 'right'
  chatList.value.push({ msg, nikname, time, isMe, direction, isNotify, isChat })
}

//来自服务端的聊天信息发送
function serverChat({ nikname = '', msg = '', time = '' }) {
  addChat({ msg, nikname, time, isChat: true })
}

//来自服务端的登录 登出提示
function serverLog({ nikname, isLogin }) {
  let state = isLogin ? '进入' : '离开'
  let msg = `${nikname} ${state}了聊天室`
  if (nikname) {
    addChat({ msg, nikname, isNotify: true })
  }
}

//没有输入昵称就退出  返回到首页
function handleClose() {
  router.push('/')
}

</script>

<style lang="stylus">
.blog-chat
  overflow hidden
  width 80%
  margin 0 auto
  border-radius 4px

.blog-chat--wrap
  overflow hidden
  width 100%
  height 60vh
  padding 10px
  background-color rgba(0, 0, 0, .3)

.blog-chat--content
  display flex
  flex-direction row
  justify-content center
  padding 4px 0
  color #222

.blog-chat--content.left
  justify-content left

.blog-chat--content.right
  flex-direction row-reverse
  justify-content right

.blog-chat--mssage
  padding 6px 10px
  max-width 70%
  margin 0 10px
  background-color #F0F2F5
  border-radius 10px
  box-shadow 0 0 6px #333 inset

.blog-chat--time
  font-size 14px
  color #909399

.blog-chat--msg
  padding 4px 0

.blog-chat--notify
  padding 10px
  text-align center

.blog-chat--buttom
  display flex
  padding 10px
  background-color rgba(0, 0, 0, .6)
</style>