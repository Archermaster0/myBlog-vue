<template>
  <el-card>
    <div class="blog-article">
      <h3 class="blog-article--title">{{ article.title }}</h3>
      <el-divider class="blog-divider" />
      <ArticleBarInfo :info="info" />
      <div class="markdown-body blog-article--content" v-html="article.content"></div>
      <div class="blog-article--tags">
        <span class="blog-tags--content">文章标签:</span> <el-tag type="primary" size="small"
          class="blog-tags--columnName">{{
            columnName }}</el-tag>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue';
import ArticleBarInfo from '@/components/article/ArticleBarInfo.vue'

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
@import '../../assets/css/base.styl'
// @import '../../assets/css/typo.styl'

.blog-article
  display flex
  flex-direction column 
  padding padding-space
  font-size 16px
  border-radius radius-theme-size

.blog-article .blog-article--title
  margin 0
  padding padding-space 0
  font-size 28px
  font-weight 600
  line-height 28px
  word-break break-word

.blog-article .blog-divider
  margin 10px 0
  border-top: 2px solid line-theme-color;

.blog-article--content
  width 100%
  padding 30px 0

.blog-article img
  display block
  width 50%
  margin 10px auto

.blog-tags--content
  padding-right 10px
</style>