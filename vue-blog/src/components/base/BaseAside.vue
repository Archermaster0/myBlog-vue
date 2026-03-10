<template>
  <div width="100%" class="blog-aside">
    <el-affix target=".blog-aside" :offset="80">
      <div class="blog-aside--userinfo">
        <div class="blog-avatar">
          <img class="blog-avatar--pic" :src="userInfo.avatar" alt="头像">
        </div>
        <div class="blog-info">
          <h3 class="blog-info--nickname">{{ userInfo.nikname }}</h3>
          <div class="blog-info--state">
            <div class="blog-state--item blog-line--col">
              <a href="#">
                <span class="blog-state--count">{{ userInfo.articleCount }}</span>
                <span class="blog-state--name">文章</span>
              </a>
            </div>
            <div class="blog-state--item">
              <a href="#">
                <span class="blog-state--count">{{ userInfo.columnCount }}</span>
                <span class="blog-state--name">分类</span>
              </a>
            </div>
          </div>
          <p class="blog-info--content">{{ userInfo.signature }}</p>
        </div>
      </div>
    </el-affix>
  </div>
</template>

<script setup>
import { useBlogStore } from '@/stores/blog_store';
import { computed, ref } from 'vue';
let blogStore = useBlogStore()
const userInfo = computed(() => blogStore.gttersUserInfo)

</script>

<style lang="stylus">
@import '../../assets/css/base.styl';

.blog-aside
  flex 1
  max-width 280px
  text-align center
  box-sizing border-box


.blog-aside--userinfo
  padding 20px
  background-color bg-theme-color
  display flex
  flex-direction column
  align-items center
  box-shadow 0 0 3px #ccc
  border-radius radius-theme-size

.blog-avatar 
  overflow hidden
  width 100px
  height 100px
  border-radius 50%
  margin 0 auto

.blog-info 
  padding-top padding-space * 3

.blog-info--nickname 
  font-size 24px
  padding-bottom padding-space
  margin 0

.blog-info--state
  display flex
  justify-content center
  padding padding-space

.blog-state--item
  padding 0 padding-space

.blog-state--item span 
  display block

.blog-state--count
  color font-theme-color
  font-weight 700

.blog-state--name
  color font-modifier-color

.blog-info--content
  padding-top padding-space
  text-align justify
  font-size font-size-p
</style>