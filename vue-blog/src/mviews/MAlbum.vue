<template>
  <div class="mblog-album--wrap">
    <van-uploader v-model="fileList" class="mblog-album--upload" :after-read="afterRead"
      :before-delete="handleRemove" />
  </div>
</template>

<script setup>
import Http from '@/api/http'
import { onBeforeMount, ref } from 'vue'
const fileList = ref([])

onBeforeMount(async () => {
  try {
    await getImages()
  } catch (error) {
    console.log(error)
  }
})

async function handleRemove(uploadFile) {
  let url = uploadFile.url
  let file = url.split('/')
  file = file[file.length - 1]
  try {
    await Http({ type: 'deleteAlbum', data: { file: file } })
    await getImages()
  } catch (error) {
    console.log(error)
  }
}

async function afterRead(upload) {
  //手动创建FormData 上传文件格式
  let formData = new FormData()
  formData.append('file', upload.file)
  try {
    await Http({ type: 'uploadAlbum', data: formData })
    await getImages()
  } catch (error) {
    console.log(error)
  }
}

async function getImages() {
  try {
    let result = await Http({ type: 'getAlbum' })
    fileList.value = result
  } catch (error) {
    console.log(error)
  }
}
</script>

<style lang="stylus">
.mblog-album--wrap
  display flex
  padding 10px
  height calc(100vh - 50px)
.mblog-album--upload .van-uploader__upload
  margin 0
  width calc(86vw / 4)
  height calc(86vw / 4)
  background-color rgb(243.9, 244.2, 244.8)
</style>