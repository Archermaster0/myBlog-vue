<template>
  <div class="blog-menu--wrap">
    <transition-group enter-active-class="animate__animated animate__backInLeft"
      leave-active-class="animate__animated animate__backOutRight">
      <el-button class="blog-btn-menu" v-for="item in circleMenuList" :key="item.icon" :icon="item.icon" circle
        @click="clickMenu(item)" />
    </transition-group>
  </div>
</template>

<script setup>
import router from '@/router';

const props = defineProps({
  circleMenuList: Array
})

function clickMenu(menu) {
  let { route } = menu
  if (!route) {
    return
  }
  router.push(route)
}

</script>

<style lang="stylus">
.blog-menu--wrap
  display flex
  flex-direction column
  justify-content center
  align-items center

.el-button.blog-btn-menu
  width 40px
  height 40px
  font-size 16px


.el-button.blog-btn-menu+.el-button.blog-btn-menu
  margin 10px 0 0 0
</style>