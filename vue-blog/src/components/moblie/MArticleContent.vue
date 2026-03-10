<template>
  <div class="mblog-article">
    <h1 class="mblog-article--title">{{ article.title }}</h1>
    <van-divider />
    <MArticleBarInfo :info="info" />
    <article class="markdown-body mblog-article--content" v-html="article.content"></article>
    <div class="mblog-article--tags">
      <span class="mblog-tags--item">文章标签:</span> <el-tag type="primary" size="small" class="blog-tags--columnName">{{
        columnName }}</el-tag>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import MArticleBarInfo from './MArticleBarInfo.vue';
const props = defineProps({
  article: {
    type: Object,
    default: function () {
      return {
        title: '默认标题',
        date: "默认日期",
        like_num: 0,
        hit_num: 0,
        comment_num: 0,
        content: ''
      }
    }
  }
})

const info = computed(() => {
  let { date, like_num, hit_num, comment_num, id } = props.article
  return { date, like_num, hit_num, comment_num, nikname, id, likeUsers }
})

const nikname = computed(() => {
  return props.article?.author?.nikname || '默认名称'
})

const columnName = computed(() => {
  return props.article?.column?.name || '默认标签'
})

const likeUsers = computed(() => {
  return props.article?.likeUsers || []
})

</script>

<style lang="stylus">
.mblog-article
  margin-bottom 20px
.mblog-article--content
  margin-bottom 20px
</style>