<template>
  <div>
    <van-cell-group title="学习资源">
      <van-cell v-for="(item, index) in studyResource" :key="index" :title="item.name" :label="item.description">
        <template #right-icon>
          <a :href="item.address">{{ item.address }}</a>
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group title="demo资源">
      <van-cell v-for="(item, index) in demoResource" :key="index" :title="item.name" :label="item.description">
        <template #right-icon>
          <a :href="item.address">{{ item.address }}</a>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script setup>
const studyResource = [
  {
    name: 'Element-Plus',
    address: 'https://element-plus.org/zh-CN/',
    description: '适用于pc端的UI库'
  },
  {
    name: 'Vue',
    address: 'https://cn.vuejs.org/',
    description: '前端最热门的开发框架'
  },
  {
    name: 'Vant4',
    address: 'https://vant-ui.github.io/vant/#/zh-CN/home',
    description: '适用于vue3的移动端UI库'
  },
]

const demoResource = [
  {
    name: '个人博客',
    address: 'https://www.ihewro.com/about.html',
    description: '挺不错的博客模板,可以作为学习参考'
  },
]
</script>

<style lang="">

</style>