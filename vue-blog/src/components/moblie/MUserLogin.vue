<template>
  <div class="mblog-user-form">
    <van-divider>
      <h2 class="mblog-user-form--title">{{ FROM_TYPE_MAP[formType].type }}</h2>
    </van-divider>
    <div class="mblog-user-form--content">
      <BaseForm :type="formType" ref="refFormRef" />
    </div>
    <div class="mblog-user-form--button">
      <van-button round block type="primary" native-type="submit" @click="submitForm">
        {{ FROM_TYPE_MAP[formType].type }}
      </van-button>
    </div>
    <p class="mblog-user-form--register" @click="handleRegister">{{ FROM_TYPE_MAP[formType].point }}</p>

  </div>

</template>

<script setup>
import BaseForm from '@/components/base/BaseForm.vue'

import { computed, onMounted, ref } from 'vue'
import { events } from '@/util/bus.js'
import { useBlogStore } from '@/stores/blog_store'
import Http from '@/api/http'
const FROM_TYPE_MAP = {
  'login': {
    type: '登录',
    point: '还没有账号? 注册一个...'
  },
  'register': {
    type: '注册',
    point: '已有账号去登陆...'
  }
}
const blogStore = useBlogStore()
const refFormRef = ref(null)
const formType = ref('login')

//登录 注册界面句柄
function handleRegister() {
  events.emit('initForm')
  formType.value = formType.value === 'login' ? 'register' : 'login'
}

//提交form数据
async function submitForm() {
  let formData = blogStore.form
  refFormRef.value.$refs['elFormRef'].validate(async (valid) => {
    if (valid) {
      try {
        await Http({ type: formType.value, data: formData })
        blogStore.login()
      } catch (err) {
        refFormRef.value.$refs['elFormRef'].resetFields()
      }

    } else {
      console.log('error submit!')
      return false
    }
  })
}

</script>

<style lang="stylus">
.mblog-user-form
  overflow hidden
  margin 10vh 10px
  padding-bottom 10px
  background-color #fff
  border-radius 12px
  border 1px solid #ccc
.mblog-user-form--title
  padding 40px 0
  font-size 36px
  color #222
  text-align center
.mblog-user-form--content
  padding-right 36px
.mblog-user-form--button
  margin 16px
  margin-top 40px
.mblog-user-form--register
  padding 0 20px
  text-align right
  font-size 14px
  color blue
</style>