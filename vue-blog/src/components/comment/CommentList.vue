<template>
  <div>
    <div class="blog-comment blog-comment--list">
      <ul>
        <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
      </ul>
      <el-empty v-if="commentLength === 0" description="还没有评论内容" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import CommentItem from './CommentItem.vue';
const props = defineProps({
  comments: Array
})

const commentLength = computed(() => props.comments?.length)

</script>

<style lang="stylus">
@import '../../assets/css/base.styl'

.blog-comment
  font-size 16px
  margin-top padding-space * 2
  border-radius radius-theme-size

</style>