<template>
  <div class="mblog-user-center">
    <component :is="userCenterComponent"></component>
  </div>
</template>

<script setup>
import MUserLogin from '@/components/moblie/MUserLogin.vue'
import MUserCenter from '@/components/moblie/MUserCenter.vue'
import { useBlogStore } from '@/stores/blog_store'
import { computed } from 'vue';
const blogStore = useBlogStore()

//动态组件
const userCenterComponent = computed(() => blogStore.token ? MUserCenter : MUserLogin)
</script>

<style lang="stylus">
.mblog-user-center
  height calc(100vh - 50px)
</style>