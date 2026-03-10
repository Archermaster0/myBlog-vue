<template>
  <el-card class="blog-editor">
    <h3 class="blog-editor--title">写下你的故事...</h3>
    <el-divider />
    <el-input class="blog-editor--input" v-model="title" placeholder="请输入故事标题" required></el-input>
    <div class="blog-editor-textarea--wrap">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
        mode="default" />
      <Editor class="blog-editor-textarea--editor" v-model="valueHtml" :defaultConfig="editorConfig" mode="default"
        @onCreated="handleCreated" />
    </div>
    <div class="blog-editor-tags--wrap">
      <el-radio-group v-model="column">
        <el-radio-button v-for="(item) in columns" :key="item.id" :value="item.id" class="blog-tags--item">{{ item.name
        }}</el-radio-button>
        <el-input v-if="inputVisible" ref="InputRef" v-model="inputValue" class="w-20 button-new-input blog-tags--item"
          size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
        <el-button v-else class="button-new-tag blog-tags--item" size="default" @click="showInput">
          + 创建新的标签
        </el-button>
      </el-radio-group>
    </div>
    <div class="blog-editor--button">
      <el-button type="primary" @click="submitEditor" plain>提交</el-button>
      <el-button type="info" @click="cancelEditor" plain>重置</el-button>
    </div>
  </el-card>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { shallowRef, ref, nextTick, onBeforeUnmount, onBeforeMount } from 'vue';
import { useBlogStore } from '@/stores/blog_store'
import { ElNotification } from 'element-plus';
import Http from '@/api/http';
import router from '@/router';
import { useRoute } from 'vue-router';

const route = useRoute()
const blogStore = useBlogStore()
const editorRef = shallowRef()
const valueHtml = ref('')
const title = ref('')
const cover = ref('')
const columns = ref([])
const column = ref('')
const inputVisible = ref(false)
const InputRef = ref(null)
const inputValue = ref('')
const toolbarConfig = {}

let editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {}
}

editorConfig.MENU_CONF['uploadImage'] = {
  server: import.meta.env.VITE_FILE_UPLOAD_PATH, //上传地址
  // form-data fieldName ，默认值 'wangeditor-uploaded-image'
  fieldName: 'file',
  // 单个文件的最大体积限制，默认为 2M
  maxFileSize: 1 * 1024 * 1024, // 1M
  // 最多可上传几个文件，默认为 100
  maxNumberOfFiles: 10, //限制不生效 想要限制需要去服务端手动限制
  // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
  allowedFileTypes: ['image/*'],
  // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
  meta: {
    token: 'xxx',
    otherKey: 'yyy'
  },
  // 将 meta 拼接到 url 参数中，默认 false
  metaWithUrl: false,
  // 自定义增加 http  header
  headers: {
    'Authorization': `Bearer ${blogStore.token}`,
    // otherKey: 'xxx'
  },
  // 跨域是否传递 cookie ，默认为 false
  withCredentials: true,
  // 超时时间，默认为 10 秒
  timeout: 5 * 1000,
  onSuccess(file, res) {
    cover.value = res.data.url
  },
  // 单个文件上传失败
  onFailed(file, res) {
    console.log(`${file.name} 上传失败`, res)
  },

  // 上传错误，或者触发 timeout 超时
  onError(file, err, res) {
    console.log(`${file.name} 上传出错`, err, res)
    ElNotification({
      title: '错误',
      message: err,
      type: 'error',
    })
  },
}

onBeforeMount(() => {
  getColumns()
})

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

//获取分类
async function getColumns() {
  try {
    let result = await Http({ type: 'columns' })
    columns.value = result?.list
    if (route.query.columnID) {
      column.value = route.query.columnID
      return
    }
    column.value = columns.value?.[0].id
  } catch (err) {
    console.log(err)
  }
}

//点击创建标签  显示输入框
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value?.input?.focus()
  })
}

//提交标签内容
const handleInputConfirm = async () => {
  try {
    if (inputValue.value) {
      await Http({ type: 'postColumn', data: { name: inputValue.value } })
      getColumns()
    }
    inputVisible.value = false
    inputValue.value = ''
  } catch (err) {
    console.log(err)
  }

}

//清空内容
function cancelEditor() {
  title.value = ''
  valueHtml.value = ''
}

//数据提交
function submitEditor() {
  if (!validateEditor()) {
    return
  }
  postEditorData()
}

//文章内容 数据验证
function validateEditor() {
  if (title.value.trim().length === 0) {
    ElNotification({
      title: '错误',
      message: `请填写标题`,
      type: 'error',
    })
    return false
  }
  if (valueHtml.value.trim().length === 0) {
    ElNotification({
      title: '错误',
      message: `文章内容不能为空`,
      type: 'error',
    })
    return false
  }
  return true
}

//提交文章内容到服务端
async function postEditorData() {
  try {
    Http({ type: 'postArticle', data: { title: title.value, content: valueHtml.value, column: column.value, cover: cover.value } })
    ElNotification({
      title: '提交成功',
      type: 'success',
    })
    router.push('/index')
  } catch (err) {
    ElNotification({
      title: '错误',
      message: '文章提交出错',
      type: 'error',
    })
  }
}

</script>

<style lang="stylus">
@import '@wangeditor/editor/dist/css/style.css'
.blog-editor--title
  font-size 20px
  font-weight 700
  color rgb(121.3, 187.1, 255)
  line-height 24px
.el-divider--horizontal
  border-top 3px solid rgb(159.5, 206.5, 255)
  margin 10px 0 20px 0
.blog-editor-textarea--wrap
  margin 20px 0
  border 1px solid #ccc
.w-e-text-container .w-e-scroll
  min-height 300px
.blog-editor-tags--wrap
  display flex
  align-items center
  margin-bottom 20px
.blog-tags--item
  padding 0
  margin-right 4px
  margin-bottom 4px
  border 1px solid #ccc
  border-radius 4px
.blog-editor-textarea--editor
  text-align left
.button-new-input
  max-width 120px
.button-new-tag
  padding 0 10px
  max-width 120px
.blog-editor--button
  display flex
  justify-content space-around
  & .el-button
    flex 1




</style>