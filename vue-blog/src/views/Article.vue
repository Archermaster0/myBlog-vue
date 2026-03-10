<template>
  <div class="blog-article--wrap" typo>
    <ArticleContent :article="article" />
    <el-card class="blog-comment--wrap">
      <h3 class="blog-comment--title">评论 <span>{{ article?.comments?.length }}</span></h3>
      <CommentTextArea :aid="id" />
      <CommentList :comments="article.comments" />
    </el-card>
  </div>
</template>

<script setup>
import Http from '@/api/http';
import ArticleContent from '@/components/article/ArticleContent.vue';
import CommentTextArea from '@/components/comment/CommentTextArea.vue';
import CommentList from '@/components/comment/CommentList.vue';
import { onBeforeMount, provide, ref } from 'vue';

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
@import '../assets/css/typo.styl'
  
.blog-article--wrap
  height 100%
.blog-comment--wrap
  margin-top 10px
.blog-comment--title
  padding 8px 0 20px 0
</style>