<template>
  <article class="blog-content--item">
    <img class="blog-item--illu" :src="article.cover" alt="文章封面">
    <div class="blog-item--introduction">
      <h3 class="blog-item--title">{{ article.title }}</h3>
      <p class="blog-item--desc" v-once v-html="content"></p>
      <p class="blog-item--tags">
        <span class="blog-tags--hit"><i class="iconfont">&#xe68c;</i> {{ article.hit_num }}</span><span
          class="blog-tags--like" :class="{ active: blogStore.isLikeState(article.id) }" @click.prevent="actionLike"><i
            class="iconfont">&#xe600;</i>
          {{ article.like_num }}</span><span class="blog-item--author">作者: {{ article.author.nikname
          }}</span>
      </p>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useBlogStore } from '@/stores/blog_store'
const blogStore = useBlogStore()

const props = defineProps({
  article: Object
})

const content = computed(() => {
  let content = props.article.content.match(/>([^><]+)</)?.[1] || '默认内容' + '...'
  return content || '默认内容'
})

function actionLike() {
  blogStore.changeLikes({ aid: props.article._id })
}

</script>

<style lang="stylus">
@import '../../assets/css/base.styl';

.blog-content--item
  display flex
  justify-content center
  height 120px
  padding 0 padding-space * 1.5
  align-items center
  border-radius radius-theme-size * 2


.blog-item--illu
  width 180px
  height 120px
  padding padding-space

.blog-item--introduction
  display flex
  flex-direction column
  justify-content space-between
  height 100%
  flex 1
  padding 0 padding-space * 1.5

.blog-item--title
  font-size 18px
  font-weight 500
  color #222226
  &:hover
    text-decoration underline

.blog-item--desc
  flex 1
  padding padding-space 0
  font-size 14px
  color rgb(85, 86, 102)
  text-align left

.blog-item--tags
  display flex
  justify-content flex-start

.blog-tags--hit,
.blog-tags--like,
.blog-tags--comment,
.blog-item--author
  margin-right padding-space * 2
  font-size 14px
  color lighten(rgb(85, 86, 102), 30%)
  &:hover
    color lighten(rgb(85, 86, 102), 60%)

.blog-tags--like.active
  color #409EFF
</style>