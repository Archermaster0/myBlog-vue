<template>
  <van-tabbar v-model="active" route>
    <van-tabbar-item :to="{ name: 'mIndex' }" icon="home-o">首页</van-tabbar-item>
    <van-tabbar-item :to="{ name: 'mAlbum' }" icon="search">画廊</van-tabbar-item>
    <van-tabbar-item :to="{ name: 'mAbout' }" icon="friends-o">自述</van-tabbar-item>
    <van-tabbar-item :to="{ name: 'mUser' }" icon="setting-o">我的</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref } from 'vue';

const active = ref(0);
</script>

<style lang="">

</style>