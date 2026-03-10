<template>
  <li class="blog-comment--item">
    <div class="blog-comment--avatar">
      <img :src="comment.uid.avatar" alt="用户头像">
    </div>
    <div class="blog-comment--container">
      <span class="blog-comment--name">{{ comment.uid.nikname }}</span>
      <p class="blog-comment--content">{{ comment.content }}</p>
      <div class="blog-comment-info">
        <span class="blog-comment-info--date">{{ comment.date }}</span>
        <span class="blog-comment-info--like">点赞</span>
        <span class="blog-comment-info--editor">回复</span>
      </div>
    </div>

  </li>
</template>

<script setup>
defineProps({
  comment: Object
})
</script>

<style lang="stylus">
@import '../../assets/css/base.styl'

.blog-comment--item
  display flex
  justify-content start
  margin-bottom 30px

.blog-comment--avatar
  overflow hidden
  width 32px
  height 32px
  margin-right 10px
  border-radius 50%

.blog-comment--container
  flex 1

.blog-comment--name
  color font-theme-color

.blog-comment--content
  overflow hidden
  padding 12px 0
  word-wrap break-word
  word-break break-word
  color #222

.blog-comment-info>span
  margin-right 20px
  font-size 14px
  color font-modifier-color

</style>