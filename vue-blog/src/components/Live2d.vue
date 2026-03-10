<template>
  <div class="live2d-wrap">
    <canvas id="live2d" width="200" height="200" class="live2d"></canvas>
  </div>
</template>

<script setup>
import '@/static/js/live2d'
import { onMounted } from 'vue'

onMounted(() => {
  loadlive2d("live2d", "https://live2d.fghrsh.net/api/get/?id=1-4") 
})

</script>

<style lang="stylus">
.live2d 
  position fixed
  bottom 0px
  left 20px
</style>