<template>
  <div>
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" error-text="请求失败，点击重新加载"
        offset="50" @load="onLoad">
        <router-link v-for="article in articles" :key="article.id"
          :to="{ name: 'mArticle', params: { id: article.id } }">
          <MArticleItem :article="article" />
        </router-link>
      </van-list>
    </van-pull-refresh>

  </div>
</template>

<script setup>
import Http from '@/api/http';
import MArticleItem from '@/components/moblie/MArticleItem.vue'
import { useBlogStore } from '@/stores/blog_store'
import { onBeforeMount, ref } from 'vue';
import { events } from '@/util/bus.js'

const articles = ref([])
const pageSize = ref(8)//每页展示文章数
const currentPage = ref(1)//当前页码
const searchVal = ref('')//搜索内容
const blogStore = useBlogStore()
const loading = ref(false);
const finished = ref(false);
const error = ref(false);
const refreshing = ref(false);


//加载更多数据
function onLoad() {
  getArticles()
}

//下拉刷新数据
function onRefresh() {
  // 清空列表数据
  finished.value = false
  currentPage.value = 1

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad()
}

events.on('activeSearch', (value) => {
  searchVal.value = value
  resetArticles()
  getArticles()
})

function resetArticles() {
  articles.value = []
  finished.value = false
  currentPage.value = 1
}

async function getArticles() {
  try {
    let data = { size: pageSize.value, page: currentPage.value }
    if (searchVal.value) {
      data.query = { search: searchVal.value }
    }
    if (refreshing.value) {
      articles.value = [];
      refreshing.value = false;
    }
    let result = await Http({ type: 'articles', data })
    articles.value.push(...result.list)
    articles.value.map(item => {
      item.like_num = item.likeUsers?.length
    })
    loading.value = false;
    currentPage.value++
    if (articles.value.length >= result.total) {
      finished.value = true;
    }
  } catch (err) {
    console.log(err)
    loading.value = false;
    error.value = true;
  }
}
</script>

<style lang="">

</style>