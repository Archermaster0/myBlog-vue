<template>
  <div class="mblog-userinfo-set">
    <van-form @submit="onSubmit" ref="userFormRef" class="mblog-userinfo-set--form">
      <van-uploader v-model="fileList" multiple :max-count="1" :deletable="false" reupload preview-size="6rem"
        class="mblog-userinfo-set--avatar" :after-read="afterRead">
        <van-image round width="6rem" height="6rem" :src="userInfo.avatar" />
      </van-uploader>
      <van-cell-group class="mblog-userinfo-set--content" inset>
        <van-field v-for="item in formData" v-model="userInfo[item.query]" :placeholder="userInfo[item.query]"
          :name="item.query" :label="item.label" :disabled="item.query === 'username'" />
      </van-cell-group>
      <div style="margin: 16px;margin-top: 30px;" class=" mblog-userinfo-set--button">
        <van-button round block type="primary" @click="onSubmit">
          修改
        </van-button>
        <van-button round block type="default" @click="logout">
          退出登录
        </van-button>
      </div>
    </van-form>
  </div>

</template>

<script setup>
import { useBlogStore } from '@/stores/blog_store'
import { computed, onBeforeMount, ref, watch } from 'vue';
import { showNotify } from 'vant';
import FORM_DATA from '@/config/form.config'
import Http from '@/api/http';
import router from '@/router';

const blogStore = useBlogStore()
const userInfo = ref({})
const fileList = ref([])
const avatarUrl = ref('')
const userFormRef = ref(null)

onBeforeMount(() => {
  getUserInfo()
})

watch(userInfo, (newValue) => {
  blogStore.form = newValue
},
  { deep: true }
)

const formData = computed(() => {
  return FORM_DATA['userInfo'].filter(item => {
    return item.query !== 'avatar'
  })
})

async function afterRead(upload) {
  //手动创建FormData 上传文件格式
  let formData = new FormData()
  formData.append('file', upload.file)
  try {
    let result = await Http({ type: 'uploadUser', data: formData })
    avatarUrl.value = result.fileURL
  } catch (error) {
    console.log(error)
  }
}

async function getUserInfo() {
  try {
    userInfo.value = await Http({ type: 'getUserInfo' })
  } catch (err) {
    console.log(err)
  }
}

function logout() {
  blogStore.logout()
  router.push({ name: 'mIndex' })
}

function onSubmit() {
  let lasteData = userFormRef.value.getValues()
  userFormRef.value.validate().then(async () => {
    try {
      if (avatarUrl.value) {
        lasteData.avatar = avatarUrl.value
      }
      await Http({ type: 'putUserInfo', data: lasteData })
      await getUserInfo()
      showNotify({ type: 'success', message: '修改成功' });
    } catch (error) {
      console.log(error)
      //重置表单
      userFormRef.value.resetValidation
    }
  }).catch(err => console.log(err))
}
</script>

<style lang="stylus">
.mblog-userinfo-set
  padding-top 10vh
  height calc(100vh - 50px)
  text-align center
  background-color #F7F8FA
.mblog-userinfo-set--avatar
  margin-bottom 30px
  height 6rem
  width 6rem
  & .van-image__img
    border-radius 50%
.mblog-userinfo-set--button button
  margin-bottom 20px

</style>