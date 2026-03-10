<template>
  <div class="blog-article--wrap">
    <el-card class="blog-article--item" v-for="article in articles" :key="article.id">
      <router-link :to="{ name: 'article', params: { id: article.id } }">
        <ArticleItem :article="article" />
      </router-link>
    </el-card>
    <el-pagination class="blog-article--pagination" v-model:current-page="currentPage" v-model:page-size="pageSize"
      layout="prev, pager, next, jumper" :total="totalArticles" />
  </div>
</template>

<script setup>
import Http from '@/api/http';
import { onBeforeMount, ref, watch, watchEffect } from 'vue';
import ArticleItem from '@/components/article/ArticleItem.vue';
import { RouterLink } from 'vue-router';
import { events } from '@/util/bus.js'
import { useBlogStore } from '@/stores/blog_store'
const articles = ref([])
const pageSize = ref(8)//每页展示文章数
const currentPage = ref(1)//当前页码
const totalArticles = ref(0)//文章总数
const searchVal = ref('')//搜索内容
const blogStore = useBlogStore()

onBeforeMount(() => {
  getArticles()
})

watch(() => currentPage.value, () => {
  articles.value = []
  getArticles()
  events.emit('changeScroll')
})

watchEffect(() => {
  articles.value.map(item => {
    if (item._id === blogStore.changeAid) {
      item.like_num = blogStore.gttersLikeNum
    }
  })
})

events.on('activeSearch', (value) => {
  searchVal.value = value
  resetArticles()
  getArticles()
})

function resetArticles() {
  articles.value = []
  currentPage.value = 1
}

async function getArticles() {
  try {
    let data = { size: pageSize.value, page: currentPage.value }
    if (searchVal.value) {
      data.query = { search: searchVal.value }
    }
    let result = await Http({ type: 'articles', data })
    totalArticles.value = result.total
    if (articles.value.length >= result.total) {
      console.log('没有更多了')
      return
    }
    articles.value.push(...result.list)
    articles.value.map(item => {
      item.like_num = item.likeUsers?.length
    })
  } catch (err) {
    console.log(err)
  }
}

</script>

<style lang="stylus">
@import '../assets/css/base.styl';
.blog-article--wrap
  overflow hidden
  height 100%
  padding 0 10px

.blog-article--pagination
  display flex
  justify-content center
  width 100%

.blog-article--item
  margin-bottom 16px
  border-radius 4px
  border 0
  background-color rgba(216.8, 235.6, 255, .3)
  box-shadow 0 0 4px line-theme-color
  &:hover
    background-color rgba(216.8, 235.6, 255, .3)
    box-shadow 0 2px 14px #ccc


</style>