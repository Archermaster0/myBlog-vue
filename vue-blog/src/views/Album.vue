<template>
  <div class="blog-album">
    <el-upload v-model:file-list="fileList" :action="userFIleAction" list-type="picture-card" :on-success="getImages"
      :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
      <el-icon>
        <Plus />
      </el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible" :show-close="false">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>

</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import Http from '@/api/http'
const fileList = ref([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const userFIleAction = computed(() => import.meta.env.VITE_FILE_ALBUM_PATH)

let oI = document.querySelector('.el-icon--close-tip')

onBeforeMount(async () => {
  try {
    await getImages()
  } catch (error) {
    console.log(error)
  }
})

//删除图片
async function handleRemove(uploadFile) {
  let url = uploadFile.url
  let file = url.split('/')
  file = file[file.length - 1]
  try {
    await Http({ type: 'deleteAlbum', data: { file: file } })
  } catch (error) {
    console.log(error)
  }
}

//图片全览
function handlePictureCardPreview(uploadFile) {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
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
.blog-album
  display flex
</style>