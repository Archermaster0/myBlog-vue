<template>
  <div class="blog-page">
    <el-container class="blog-container">
      <el-scrollbar ref="scrollbarRef">
        <el-affix :offset="0" z-index="999">
          <el-header class="blog-header">
            <BaseHeader />
          </el-header>
        </el-affix>
        <div ref="bannerRef" class="blog-banner" v-if="route.name === 'index'">
          <el-row>
            <el-col :span="24">
              <el-image class="blog-banner--image" src="src/assets/img/banner.jpg" fit="cover" />
            </el-col>
          </el-row>
        </div>

        <el-container class="blog-content">
          <el-row class="blog-content--wrap" justify="center">
            <el-col :span="18" :md="18" :lg="18" :xs="23">
              <el-main class="blog-main">
                <router-view v-slot="{ Component }">
                  <component :is="Component" />
                </router-view>
              </el-main>
            </el-col>
            <el-col :span="6" class="hidden-xs-only blog-content--aside">
              <BaseAside v-if="blogStore.token" />
            </el-col>
          </el-row>

        </el-container>

        <el-footer class="blog-footer">
          <BaseFooter />
        </el-footer>
      </el-scrollbar>
    </el-container>
    <BaseModel />
    <Live2d />
  </div>
</template>

<script setup>
import { RouterView, useRoute } from "vue-router";
import { onBeforeMount, onMounted, ref } from 'vue'
import { useBlogStore } from '@/stores/blog_store';
import BaseModel from "@/components/base/BaseModal.vue";
import BaseHeader from "@/components/base/BaseHeader.vue";
import BaseAside from "@/components/base/BaseAside.vue";
import BaseFooter from "@/components/base/BaseFooter.vue";
import Live2d from "@/components/Live2d.vue";
import { events } from "@/util/bus";

const blogStore = useBlogStore()
const route = useRoute()
const scrollbarRef = ref(null)
const bannerRef = ref(null)

//在挂载之前判断是否存在token
onBeforeMount(async () => {
  let isLogin = blogStore.token
  if (isLogin) {
    try {
      await blogStore.getUserInfo()
      // await blogStore.online()//根据token登录的时候  自动连接会话
    } catch (err) {
      console.log(err)
    }
  }
})

onMounted(() => {
  events.on('changeScroll', () => changeScroll())
})

function changeScroll() {
  scrollbarRef.value?.setScrollTop(bannerRef.value.offsetHeight)
}



</script>

<style lang="stylus">
@font-face {
  font-family: 'iconfont';
  src: url('../assets/fonts/iconfont.eot');
  src: url('../assets/fonts/iconfont.eot?#iefix') format('embedded-opentype'),
  url('../assets/fonts/iconfont.woff') format('woff'),
  url('../assets/fonts/iconfont.ttf') format('truetype'),
  url('../assets/fonts/iconfont.svg#iconfont') format('svg');
}
.iconfont{
  font-family:"iconfont" !important;
  font-size:16px;font-style:normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}

.blog-page
  height 100%
.blog-container
  display block
  overflow hidden
  height 100%
.blog-banner
  width 100%
.blog-banner--image
  width 100%
  height 100vh

.blog-content
  overflow hidden
  display flex
  flex-direction row
  justify-content center
  min-height (80vh)
  padding 20px 30px
  margin-bottom 60px
.blog-content--wrap
  width 1200px
  margin 0 auto
.blog-content--aside
  display flex
  justify-content center
  width 100%
.el-col
  width 100%
  height 100%
.blog-main
  padding 0 10px
  height 100%
.blog-footer
  height 10vh
  background-color #F5F7FA
</style>
