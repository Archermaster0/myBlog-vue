<template>
  <div class="mblog-article--info">
    <div class="mblog-info--content">
      <span class="mblog-info--nikname">作者: {{ info.nikname }}</span>
      <span class="mblog-info--date">
        <i class="iconfont">&#xe61d;</i>
        {{ info.date }}
      </span>
    </div>
    <div class="mblog-info--button">
      <span class="mblog-info--hit">
        <i class="iconfont">&#xe68c;</i>
        {{ info.hit_num }}
      </span>
      <span class="mblog-info--like" :class="{ active: blogStore.isLikeState(aid) }" @click.prevent="actionLike">
        <i class="iconfont">&#xe600;</i>
        {{ likeNum }}
      </span>
      <span class="mblog-info--comment" @click="handlerFocusTextarea">
        <i class="iconfont">&#xe891;</i>
        {{ info.comment_num }}
      </span>
    </div>
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
.mblog-article--info
  padding 10px
  margin-bottom 10px
  color #909399
  background-color #E6E8EB
.mblog-info--content
  padding-bottom 10px
.mblog-info--nikname,
.mblog-info--hit,
.mblog-info--like
  padding-right 30px
</style>