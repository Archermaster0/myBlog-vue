<template>
  <div class="blog-article--info">
    <span class="blog-info--nikname">{{ info.nikname }}</span>
    <span class="blog-info--date">
      <i class="iconfont">&#xe61d;</i>
      {{ info.date }}
    </span>
    <span class="blog-info--hit">
      <i class="iconfont">&#xe68c;</i>
      {{ info.hit_num }}
    </span>
    <span class="blog-info--like" :class="{ active: blogStore.isLikeState(aid) }" @click.prevent="actionLike">
      <i class="iconfont">&#xe600;</i>
      {{ likeNum }}
    </span>
    <span class="blog-info--comment" @click="handlerFocusTextarea">
      <i class="iconfont">&#xe891;</i>
      {{ info.comment_num }}
    </span>

  </div>
</template>

<script setup>
import { events } from '@/util/bus.js'
import { useBlogStore } from '@/stores/blog_store'
import { computed, watch } from 'vue';
const blogStore = useBlogStore()

const props = defineProps({
  info: Object
})

const aid = computed(() => {
  return props.info.id
})

watch(() => blogStore.gttersLikeNum, (newVal) => {
  likeNum = newVal
})

let likeNum = computed(() => {
  return props.info?.likeUsers?.value.length
})

function handlerFocusTextarea() {
  events.emit('focusTextarea')
}

async function actionLike() {
  blogStore.changeLikes({ aid: aid.value })
}

</script>

<style lang="stylus">

.blog-article--info
  display flex
  align-items center
  font-size 14px
  background-color line-modifier-color
  color #999

.blog-article--info>span
  padding-right 20px

.blog-info--nikname,
.blog-info--comment,
.blog-info--like
  cursor pointer

.blog-info--like.active
  color #409EFF
</style>