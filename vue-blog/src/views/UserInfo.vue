<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>用户信息</span>
      </div>
    </template>
    <BaseForm v-if="isCreated" ref="refForm" type="userInfo" />
    <div class="blog-info-btn--wrap">
      <el-button type="primary" @click="submit">提交</el-button>
      <el-button type="info" @click="rest">重置</el-button>
    </div>
  </el-card>
</template>

<script setup>
import BaseForm from '@/components/base/BaseForm.vue';
import { nextTick, ref } from 'vue';
import { useBlogStore } from '@/stores/blog_store'
import router from '@/router';
import Http from '@/api/http';
const refForm = ref()
const blogStore = useBlogStore()
const isCreated = ref(true)

function submit() {
  let elForm = refForm.value.$refs.elFormRef
  let formData = blogStore.form
  elForm.validate(async (valid) => {
    if (valid) {
      try {
        await Http({ type: 'putUserInfo', data: formData })
        blogStore.getUserInfo()
        router.push('/')
      } catch (error) {
        console.log(error)
      }
    }
  })
}

//重置表单 销毁 重新渲染即可
function rest() {
  isCreated.value = false
  nextTick(() => {
    isCreated.value = true
  })
}

</script>

<style lang="">

</style>