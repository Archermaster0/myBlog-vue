<template>
  <van-sticky>
    <van-nav-bar v-if="route.meta.isShow" left-arrow class="mblog-header" z-index="99">
      <template #title>
        <van-search class="mblog-search" v-model="searchValue" shape="round" @search="onSearch"
          placeholder="请输入文章关键词" />
      </template>
      <!-- <template #right>
        <van-cell @click="showPopup" class="mblog-sidebar">
          <template #title>
            <van-icon name="ellipsis" />
          </template>
        </van-cell>
        <van-popup v-model:show="showRight" position="right" :style="{ width: '60%', height: '100%' }">

        </van-popup>
      </template> -->
      <template #left>
        <van-image round width="50" height="50" :src="url" />
      </template>
    </van-nav-bar>
    <van-nav-bar v-if="route.meta.title" :title="route.meta.title" left-text="返回" left-arrow
      @click-left="onClickLeft" />
  </van-sticky>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useBlogStore } from '@/stores/blog_store';
import { useRoute } from 'vue-router'
import { events } from '@/util/bus.js'

const route = useRoute()

const url = ref('src/assets/img/logo.png')
let blogStore = useBlogStore()

const searchValue = ref('')
const show = ref(false)
const userInfo = computed(() => blogStore.gttersUserInfo)

const showRight = ref(false)
const showPopup = () => {
  showRight.value = true
}
const onClickLeft = () => history.back()

function onSearch(value) {
  events.emit('activeSearch', value)
  searchVal.value = ''
}


</script>

<style lang="stylus">
.mblog-header
  padding 6px
  background-color rgba(255,255,255,0.8)
.mblog-search
  background-color rgba(255,255,255,0)
.mblog-sidebar
  background-color none

  
</style>