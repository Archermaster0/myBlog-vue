<template>
  <el-card class="blog-comment--wrap">
    <h3 class="blog-comment--title">评论 <span>{{ article?.comments?.length }}</span></h3>
    <CommentTextArea :aid="id" />
    <CommentList :comments="article.comments" />
  </el-card>
</template>

<script>
import Http from '@/api/http';
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

const value = ref('')
</script>

<style lang="stylus">

</style>