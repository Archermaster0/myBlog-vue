<template>
  <el-row class="blog-header--wrap" justify="center">
    <el-col :span="2" :xs="{ span: 24 }">
      <div class="blog-logo">
        <el-image class="blog-logo--pic" :src="url" fit="fill" />
      </div>
    </el-col>
    <el-col :span="14" class="hidden-xs-only">
      <el-menu class="blog-menu" mode="horizontal" :default-active="activeIndex" router>
        <el-menu-item index="/index">首页</el-menu-item>
        <el-menu-item index="/articles">文章</el-menu-item>
        <el-menu-item index="/chat">聊天</el-menu-item>
        <el-menu-item index="/album">画廊</el-menu-item>
        <el-menu-item index="/about">关于我</el-menu-item>
        <el-menu-item index="/resource">资源库</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="4" class="hidden-xs-only">
      <div class="blog-search">
        <el-input v-model="searchVal" style="max-width: 600px" placeholder="搜索文章" class="input-with-select"
          @keydown.native.enter="activeSearch">
          <template #append class="blog-search--btn">
            <el-button icon="Search" @click="activeSearch" />
          </template>
        </el-input>
      </div>
    </el-col>
    <el-col :span="2" class="hidden-xs-only">
      <component :is="loginComponent"></component>
    </el-col>

    <el-col :span="2" class="hidden-xs-only">
      <el-dropdown placement="bottom-start" class="blog-btn-creation">
        <el-button type="primary"> <el-icon size="18">
            <CirclePlus />
          </el-icon> <span>创作</span> </el-button>
        <template #dropdown>
          <el-dropdown-menu class="blog-btn-creation--menu">
            <el-dropdown-item class="blog-btn-editor" @click="handleRouter" icon="Edit"></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>


  </el-row>
</template>

<script setup>
import { computed, ref, watch, onBeforeMount } from "vue";
import { useBlogStore } from '@/stores/blog_store'
import UserLoginHead from "@/components/user/UserLoginHead.vue"
import UserImgAvatar from "@/components/user/UserImgAvatar.vue"
import url from '../../assets/img/logo.png'
import router from '@/router';
import { useRoute } from "vue-router";
import { events } from '@/util/bus.js'
const route = useRoute()

const blogStore = useBlogStore()
const searchVal = ref('')
const activeIndex = ref('/index')
//动态组件
const loginComponent = computed(() => blogStore.token ? UserImgAvatar : UserLoginHead)

onBeforeMount(() => {
  activeIndex.value = route.path
})

watch(() => route.path, () => {
  activeIndex.value = route.path
})

function activeSearch() {
  events.emit('activeSearch', searchVal.value)
  searchVal.value = ''
}

function handleRouter() {
  router.push('/editor')
}
</script>

<style lang="stylus">
.blog-menu.blog-menu
  border 0
  background-color  rgba(255,255,255,0)
.blog-header 
  display flex
  align-items center
  background-color  rgba(255,255,255,0.8)
.blog-header--wrap
  width 100%
.blog-logo
  width 60px
  height 60px
  margin 0 auto
.blog-search
  height 60px
  padding 16px 0
  & .el-input-group__append
    padding 0 12px
.blog-header--login
  display flex
  justify-content center
  align-items center
  height 60px
  cursor pointer
.blog-btn-creation
  display flex
  justify-content center
  align-items center
  width 100%
  height 60px
.blog-btn-creation--menu
  width 84px
  padding 10px 0
.blog-btn-editor
  display flex
  justify-content center
  width 36px
  height 36px
  padding 0
  margin 0 auto
  text-align center
  border-radius 50%
  background-color #E6E8EB

.el-dropdown-menu__item i
  margin 0

i.el-input__icon.el-icon-search
  width 10px
</style>