<template>
  <div>
    <van-tabs v-if="hasColumn" v-model:active="activeName" @change="changeCloumn">
      <van-tab v-for="column in columns" :key="column._id" :title="column.name" :name="column._id" />
    </van-tabs>
    <div v-if="hasArticle" class="blog-article--wrap" v-for="article in articles" :key="article._id">
      <router-link :to="{ name: 'mArticle', params: { id: article.id } }">
        <MArticleItem :article="article" />
      </router-link>
    </div>
    <van-empty v-if="isShow" description="描述文字">
      <van-button type="primary" class="bottom-button" @click="routeEditor">开始创作</van-button>
    </van-empty>
  </div>

</template>

<script setup>
import MArticleItem from '@/components/moblie/MArticleItem.vue'
import Http from '@/api/http'
import { computed, onBeforeMount, ref } from 'vue'
import router from '@/router'
import { watchEffect } from 'vue'
import { useBlogStore } from '@/stores/blog_store'

const blogStore = useBlogStore()
const articles = ref([])
const columns = ref([])
const columnID = ref('')
const isShow = ref(false)
const size = ref(4)
const page = ref(1)
const activeName = ref('')

watchEffect(() => {
  articles.value.map(item => {
    if (item._id === blogStore.changeAid) {
      item.like_num = blogStore.gttersLikeNum
    }
  })
})

onBeforeMount(() => {
  getCloumn()
})

//判断是否有文章
const hasArticle = computed(() => {
  return articles.value.length > 0
})

//判断是否有分类
const hasColumn = computed(() => {
  return columns.value.length > 0
})

//获取分类
async function getCloumn() {
  try {
    let result = await Http({ type: 'columns' })
    columns.value = result.list
    columnID.value = columns.value?.[0]._id
    getArticles()
  } catch (err) {
    console.log(err)
  }
}

//获取文章
async function getArticles() {
  try {
    let result = await Http({ type: 'articles', data: { size: size.value, page: page.value, query: { column: columnID.value } } })
    articles.value = result.list
    articles.value.map(item => {
      item.like_num = item.likeUsers?.length
    })
    if (!(articles.value.length > 0)) {
      isShow.value = true
    } else {
      isShow.value = false
    }
  } catch (err) {
    console.log(err)
  }
}

//改变分类的回调函数
function changeCloumn() {
  columnID.value = activeName.value
  resetArticles()
  getArticles()
}

//重置文章内容
function resetArticles() {
  articles.value = []
  page.value = 1
}

//路由跳转
function routeEditor() {
  router.push({ name: 'editor', query: { columnID: columnID.value } })
}
</script>

<style lang="">

</style>