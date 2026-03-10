<template>
  <div class="blog-articles">
    <div class="blog-article--taps" v-if="hasColumn">
      <el-radio-group v-model="columnID" size="default">
        <el-radio-button class="blog-taps--item" @change="changeCloumn" :value="column.id" v-for="column in columns">{{
          column.name }}</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="hasArticle" class="blog-article--wrap">
      <el-card class="blog-article--item" v-for="article in articles" :key="article.id">
        <router-link :to="{ name: 'article', params: { id: article.id } }">
          <ArticleItem :article="article" />
        </router-link>
      </el-card>
    </div>
    <article v-if="isShow" class="blog-article-never">
      <h3 class="blog-never--title">(T_T) 很遗憾 没有找到对应的文章</h3>
      <el-button type="primary" @click="routeEditor">开始创作</el-button>
    </article>
  </div>
</template>

<script setup>
import ArticleItem from '@/components/article/ArticleItem.vue';
import Http from '@/api/http';
import { computed, onBeforeMount, ref } from 'vue';
import router from '@/router';
import { watchEffect } from 'vue';
import { useBlogStore } from '@/stores/blog_store'

const blogStore = useBlogStore()
const articles = ref([])
const columns = ref([])
const columnID = ref('')
const isShow = ref(false)
const size = ref(4)
const page = ref(1)

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

//判断是否有文章
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

<style lang="stylus">
.blog-article--taps
  padding-bottom 10px

.blog-taps--item
  margin-right 6px
  cursor pointer

.blog-article-never
  padding 100px 0
  text-align center
  background-color #fff

.blog-never--title
  padding 60px 0
  font-size 28px
  font-weight 400
  line-height 28px
</style>