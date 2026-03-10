<template>
  <div class="blog-header--login">
    <el-dropdown placement="bottom">
      <el-image class="blog-login--avatar" :src="src" fit="cover" @click="toMe" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="myArticles">我的文章</el-dropdown-item>
          <el-dropdown-item @click="setUserInfo">用户设置</el-dropdown-item>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

  </div>
</template>
<script setup>
import router from '@/router';
import { useBlogStore } from '@/stores/blog_store';
import { computed } from 'vue';

let blogStore = useBlogStore()
//响应式图片地址
const src = computed(() => blogStore.userInfo?.avatar)

function logout() {
  blogStore.logout()
  router.push('/')
}

function myArticles() {
  router.push('/articles')
}

function toMe() {
  router.push('/about')
}

function setUserInfo() {
  router.push('/userinfo')
}
</script>
<style lang="stylus">
.blog-login--avatar
  overflow hidden
  width 50px
  height 50px
  border-radius 50%
</style>