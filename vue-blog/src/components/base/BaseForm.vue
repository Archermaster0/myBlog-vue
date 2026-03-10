<template>
  <div>
    <el-form :model="form" :rules="validates" ref="elFormRef">

      <el-form-item class="blog-form-item" v-for="item in formData" :key="item.query" :prop="item.query"
        :label="item.label" label-width="100px">
        <el-upload v-if="item.type === 'avatar'" ref="upload" class="avatar-uploader" :action="userFIleAction"
          :headers="{ 'Authorization': `Bearer ${blogStore.token}`, }" :show-file-list="false"
          :on-success="handleAvatarSuccess" :on-error="handleAvatarError" :before-upload="beforeAvatarUpload">
          <img style="width: 80px; height: 80px" v-if="form[item['query']]" :src="form[item['query']]" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
        <el-input v-if="['text', 'password'].includes(item.type)" v-model="form[item.query]" :type="item.type"
          :name="item.query" :disabled="item.readonly" autocomplete="off" :placeholder="item.placeholder" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { ref, defineProps, computed, watch, onMounted } from 'vue';
import { useModalStore } from '@/stores/modal_store'
import { useBlogStore } from '@/stores/blog_store'
import FORM_DATA from '@/config/form.config'
import VALIDATE_DATE from '@/config/validate.config'
import { ElNotification } from 'element-plus';
import Http from '@/api/http';
import { events } from '@/util/bus.js'

const modalStore = useModalStore()
const blogStore = useBlogStore()
const { type } = defineProps({
  type: {
    type: String
  }
})
const form = ref({})
const elFormRef = ref()
const upload = ref()
const formData = computed(() => FORM_DATA[type])
const validates = computed(() => VALIDATE_DATE)
const userFIleAction = computed(() => import.meta.env.VITE_FILE_USER_PATH)

onMounted(() => {
  if (type === 'userInfo') {
    Http({ type: 'getUserInfo' }).then(result => form.value = result).catch(err => console.log(err))
  }
  events.on('initForm', () => initForm())
})

//监听form表单数据变化 保存对应数据 直接监听form需要开启深度监听
watch(form, (newValue) => {
  blogStore.form = newValue
},
  { deep: true }
)

//监听modalStore的isShow改变 modal不显示的时候清空数据
watch(() => modalStore.isShow, () => initForm())

//清空from数据
function initForm() {
  form.value = {}
  resetForm()
}

//重置表单数据 将表单重置为初始值 并移除校验结果
function resetForm() {
  elFormRef.value?.resetFields()
}

function handleAvatarSuccess(res) {
  form.value.avatar = res.data.fileURL
}

function handleAvatarError(err) {
  ElNotification({
    title: '上传失败',
    message: err,
    type: 'error',
  })
}

function beforeAvatarUpload(file) {
  let { size, type } = file
  if (!(/image/g.test(type))) {
    ElNotification({
      title: '上传失败',
      message: '请上传正确的图片文件',
      type: 'error',
    })
    upload.abort()
    return false
  } else if (size > 5 * 1024 * 1024) {
    ElNotification({
      title: '上传失败',
      message: '上传图片大小不得大于5M',
      type: 'error',
    })
    upload.abort()
    return false
  }
  return true
}

</script>
<style lang="stylus">
.blog-form-item
  display flex
  justify-content center
  align-items center
.avatar-uploader
  padding 0
  line-height: 0;
.avatar
  border-radius 50%
</style>
