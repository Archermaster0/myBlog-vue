<template>
  <RouterView />
</template>

<script setup>
import { onBeforeMount } from 'vue';
import { RouterView } from 'vue-router'
import { useBlogStore } from '@/stores/blog_store';
import router from './router';
const blogStore = useBlogStore()
onBeforeMount(async () => {
  let isLogin = blogStore.token
  if (isLogin) {
    try {
      await blogStore.getUserInfo()
      // await blogStore.online()//根据token登录的时候  自动连接会话
    } catch (err) {
      console.log(err)
    }
  }
  //判断如果是移动端 就跳转到移动页面
  isMoblie() && router.replace('/m') || router.replace('/')
})

function isMoblie() {
  //获取用户设备信息 判断用户设备是否是移动端
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/)
}
</script>