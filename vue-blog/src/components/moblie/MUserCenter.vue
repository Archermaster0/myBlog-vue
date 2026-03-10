<template>
  <div>
    <MUserBaseInfo :userInfo="userInfo" />
    <div class="mblog-user-center">
      <van-cell :to="{ name: 'mArticles' }" title="我的文章" />
      <van-cell :to="{ name: 'mAlbum' }" title="画廊" />
      <van-cell :to="{ name: 'mResource' }" title="资源库" />
      <van-cell :to="{ name: 'mAbout' }" title="关于我" />
      <van-cell :to="{ name: 'mUserInfo' }" title="账号设置" />
    </div>
  </div>
</template>

<script setup>
import Http from '@/api/http';
import MUserBaseInfo from '@/components/moblie/MUserBaseInfo.vue'
import { onBeforeMount, ref } from 'vue';
const userInfo = ref({})

onBeforeMount(() => {
  getUserInfo()
})

//获取用户信息
async function getUserInfo() {
  try {
    userInfo.value = await Http({ type: 'getUserInfo' })
  } catch (err) {
    console.log(err)
  }
}

</script>

<style lang="stylus">
.mblog-user-center
  padding 0 10px

</style>