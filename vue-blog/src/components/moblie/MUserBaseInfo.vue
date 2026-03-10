<template>
  <div class="mblog-user">
    <div class="mblog-user-avatar">
      <van-image round class="mblog-user-avatar--pic" width="100" height="100" :src="userInfo.avatar" />
    </div>
    <div class="mblog-user-info">
      <h3 class="mblog-user-info--nickname">{{ userInfo.nikname }}</h3>
      <div class="mblog-user-info--state">
        <div class="mblog-user-state--item">
          <a href="javascript:;">
            <span class="mblog-user-state--count">{{ userInfo.articleCount }}</span>
            <span class="mblog-user-state--name">文章</span>
          </a>
        </div>
        <van-divider vertical :hairline="false" class="mblog-line" />
        <div class="mblog-user-state--item">
          <a href="javascript:;">
            <span class="mblog-user-state--count">{{ userInfo.columnCount }}</span>
            <span class="mblog-user-state--name">分类</span>
          </a>
        </div>
      </div>
      <p class="mblog-user-info--content">{{ userInfo.signature }}</p>
    </div>
    <van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"></van-divider>
  </div>
</template>

<script setup>
defineProps({
  userInfo: {
    type: Object
  }
})
</script>

<style lang="stylus">
.mblog-user
  padding 30px 0 20px 0
  text-align center
.mblog-user-info
  padding-top 20px
.mblog-user-info--state
  display flex
  justify-content center
  padding 20px 0
.mblog-user-state--item>a
  display flex
  flex-direction column
  color #ccc
.mblog-line
  height none
  padding 0 10px
.mblog-user-info--content
  padding 0 30px
  line-height 1.5em
  text-align justify
</style>