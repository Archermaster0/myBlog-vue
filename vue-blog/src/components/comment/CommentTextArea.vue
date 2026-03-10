<template>
  <div class="blog-comment--editor">
    <div class="blog-comment--avatar">
      <img :src="userInfo.avatar" alt="用户头像">
    </div>
    <div class="blog-comment--textarea">
      <textarea ref="textarea" v-model="commentValue" class="blog-comment--input" name="comment"
        placeholder="请开始你的表演..."></textarea>
      <div class="blog-comment--button">
        <el-button type="primary" @click="submitComment">提交</el-button>
      </div>
    </div>
  </div>

</template>

<script setup>
import Http from '@/api/http';
import { ElNotification } from 'element-plus';
import { showConfirmDialog } from 'vant';
import { inject, ref, onMounted, computed } from 'vue';
import { events } from '@/util/bus.js'
import { useBlogStore } from '@/stores/blog_store'
import router from '@/router';

const blogStore = useBlogStore()
const commentValue = ref('')
const textarea = ref(null)
const getArticleById = inject('getArticleById')
const props = defineProps({
  aid: String
})
const userInfo = computed(() => {
  // blogStore.userInfo.avatar = blogStore.userInfo.avatar || './src/assets/img/default-avatar.png'
  return blogStore.userInfo
})

onMounted(() => {
  console.log(userInfo)
  events.on('focusTextarea', () => {
    focusTextarea()
  })
})

//聚焦到texttarea
function focusTextarea() {
  textarea.value?.focus()
}

async function submitComment() {
  try {
    if (commentValue.value.trim().length === 0) {
      ElNotification({
        title: '评论失败',
        message: '评论内容不能为空',
        type: 'error'
      })
      focusTextarea()
      return
    }
    if (!blogStore.token) {
      // ElNotification({
      //   title: '评论失败',
      //   message: '请先登录',
      //   type: 'error'
      // })
      showConfirmDialog({
        message: '还没有登录哟, 快去登录吧!',
        confirmButtonText: '去登录'
      })
        .then(() => {
          router.push({ name: 'mUser' })
        })
        .catch(() => {
          // on cancel
        });
      return
    }
    await Http({ type: 'postComment', data: { aid: props.aid, content: commentValue.value } })
    ElNotification({
      title: '评论成功',
      type: 'success',
    })
    getArticleById()
    commentValue.value = ''
  } catch (error) {
    throw (error)

  }
}
</script>

<style lang="stylus">
@import '../../assets/css/base.styl'
.blog-comment--editor
  display flex
  justify-content center
  margin-bottom 30px
  align-items start
.blog-comment--textarea
  display flex
  flex 1
  flex-direction column
  padding 10px 16px
  align-items center
  background-color rgb(243.9, 244.2, 244.8)
  border-radius 8px

.blog-comment--input
  margin-bottom padding-space * 2
  padding padding-space
  width 100%
  height 100px
  font-size 16px
  outline-color #52958f
  outline none
  border 0
  background-color rgb(243.9, 244.2, 244.8)
  resize none

.blog-comment--button
  display flex
  justify-content end
  width 100%
</style>