<template>
  <van-card :desc="content" :thumb="article.cover">
    <template #title>
      <h3 class="van-ellipsis mblog-item--title">{{ article.title }}</h3>
    </template>
    <template #desc>
      <p class="van-ellipsis mblog-item--desc" v-once v-html="content"></p>
    </template>
    <template #num>
      <span class="blog-tags--hit"><i class="iconfont">&#xe68c;</i> {{ article.hit_num }}</span><span
        class="blog-tags--like" :class="{ active: blogStore.isLikeState(article.id) }" @click.prevent="actionLike"><i
          class="iconfont">&#xe600;</i>
        {{ article.like_num }}</span><span class="blog-item--author">作者: {{ article.author.nikname
        }}</span>
    </template>
  </van-card>

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
.mblog-item--title
  padding-bottom 6px
  font-size 18px

.mblog-item--desc
  font-size 14px
  color #909399

.blog-tags--like.active
  color #409EFF
</style>