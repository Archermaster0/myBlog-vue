import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import base from '@/config/base.config'
import Http from '@/api/http'
import store from 'store'
import { ElNotification } from 'element-plus'
import { io } from 'socket.io-client'

const { TOKEN_NAME } = base

export const useBlogStore = defineStore('blog', () => {
  const form = ref({})
  const token = ref(store.get(TOKEN_NAME) || '')
  const userInfo = ref({})
  const isLike = ref(false)
  const likeNum = ref({})
  const gttersLikeNum = computed(() => likeNum.value?.likes)
  const gttersUserInfo = computed(() => userInfo.value)
  const changeAid = ref('')
  let socket = ref(null)

  //连接socket会话
  async function online() {
    socket.value = io(import.meta.env.VITE_USER_CHAT_PATH, { transports: ['websocket'] })
    let { nikname, _id } = gttersUserInfo.value
    //发送连接事件
    socket.value.emit('online', { nikname, uid: _id })
    //监听断开连接
    socket.value.on("disconnect", (socket) => {
      console.log(socket)
      if (socket === 'io server disconnect') {
        logout('账号已在其他设备登录')
      }
    })
    socket.value.on("connect", () => {
      console.log('建立连接')
    })
  }

  //获取用户信息
  async function getUserInfo() {
    try {
      userInfo.value = await Http({ type: 'getUserInfo' })
    } catch (err) {
      console.log(err)
      store.remove(TOKEN_NAME)
    }
  }

  //根据ID获取文章信息
  // async function getArticleById({ aid }) {
  //   try {
  //     articleInfo.value = await Http({ type: 'getArticleById', data: { id: aid } })
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

  //登录
  async function login() {
    try {
      console.log('登录成功')
      token.value = store.get(TOKEN_NAME)
      await getUserInfo()
      // await online() //登录的时候连接会话
      ElNotification({
        title: '登录成功',
        message: `欢迎你 ${userInfo.value.nikname}`,
        type: 'success',
      })
    } catch (err) {
      console.log(err)
    }
  }

  //退出登录
  async function logout(msg) {
    let message = `${userInfo.value.nikname}退出登录成功`
    if (msg) {
      message = msg
    }
    // socket.value.close()
    token.value = ''
    store.remove(TOKEN_NAME)
    // socket.value = null
    ElNotification({
      title: '退出登录',
      message,
      type: 'success',
    })
  }

  //点赞状态
  function isLikeState(aid) {
    return userInfo.value.articleLikes?.includes(aid)
  }

  //点赞和取消点赞
  async function changeLikes({ aid }) {
    isLike.value = isLikeState(aid) ? false : true
    likeNum.value = await Http({ type: 'articleLikes', data: { id: aid, isLike: isLike.value } })
    changeAid.value = aid
    getUserInfo()
  }

  return { form, token, userInfo, isLike, gttersLikeNum, likeNum, changeAid, socket, online, login, logout, getUserInfo, isLikeState, changeLikes, gttersUserInfo }
})