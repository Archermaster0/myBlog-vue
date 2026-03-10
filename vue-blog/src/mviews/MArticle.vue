<template>
  <div class="mblog-article--wrap">
    <MArticleContent :article="article" />
    <van-divider />
    <h3 class="blog-comment--title">评论 <span>{{ article?.comments?.length }}</span></h3>
    <CommentTextArea :aid="id" />
    <CommentList :comments="article.comments" />
  </div>
</template>

<script setup>
import MArticleContent from '@/components/moblie/MArticleContent.vue'
import CommentTextArea from '@/components/comment/CommentTextArea.vue'
import CommentList from '@/components/comment/CommentList.vue'
import Http from '@/api/http'
import { onBeforeMount, provide, ref } from 'vue'


const article = ref({})
const props = defineProps({
  id: String
})

provide('getArticleById', () => {
  return getArticleById()
})

onBeforeMount(() => {
  getArticleById()
})

async function getArticleById() {
  try {
    article.value = await Http({ type: 'getArticleById', data: { id: props.id } })
  } catch (err) {
    console.log(err)
  }
}
</script>

<style lang="stylus">
.mblog-article--wrap
  padding 10px
</style>