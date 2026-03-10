<template>
  <div class="blog-header--login">
    <span @click="open('login')">登录</span> / <span @click="open('register')">注册</span>
  </div>
</template>
<script setup>
import { useModalStore } from '@/stores/modal_store'
const { open } = useModalStore()
</script>
<style lang="stylus">
.blog-header--login 
  color #909399

</style>