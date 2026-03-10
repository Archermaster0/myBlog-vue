<template>
  <div class="mblog-page">
    <MHeader />
    <div class="mblog-banner" v-if="route.name === 'mIndex'">
      <van-image src="src/assets/img/banner.jpg" />
    </div>
    <div class="mblog-content">
      <router-view v-slot="{ Component }">
        <transition enter-active-class="animate__animated animate__fadeInRight" appear mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <MFooter />
  </div>
</template>

<script setup>
import MHeader from './MHeader.vue'
import MFooter from './MFooter.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style lang="stylus">
.mblog-content
  overflow hidden
  background-color #FAFCFF
.animate__fadeInRight
  animation-duration 0.5s
</style>