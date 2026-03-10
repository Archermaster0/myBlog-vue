<template>
  <div>
    <el-dialog v-model="modalStore.isShow" :title="title" width="500">

      <BaseForm v-if="hasForm" :type="type" ref="refFormRef" />

      <template #footer>
        <div class="dialog-footer">
          <el-button v-for="btn in btns" :key="btn.targetName" type="primary"
            @click="handleBtn(btn.targetName, btn.isSubmit)">{{ btn.name }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useModalStore } from '@/stores/modal_store'
import { useBlogStore } from '@/stores/blog_store'
import MODAL_DATA from '@/config/modal.config'
import BaseForm from '@/components/base/BaseForm.vue'
import Http from '@/api/http'

const modalStore = useModalStore()
const blogStore = useBlogStore()
const { open, close } = modalStore
const refFormRef = ref(null)
const type = computed(() => modalStore.type)
const title = computed(() => MODAL_DATA[modalStore.type]?.title ?? '默认modal')
const hasForm = computed(() => MODAL_DATA[modalStore.type]?.formType)
const btns = computed(() => {
  return MODAL_DATA[modalStore.type]?.btns ?? [{
    targetName: 'close',
    name: '取消'
  },
  {
    targetName: 'confirm',
    name: '提交',
  }]
})

function handleBtn(action, isSubmit) {
  if (isSubmit) {
    submitForm()
  }
  modalStore[action] && modalStore[action]()
}

//提交form数据
function submitForm() {
  let formData = blogStore.form
  refFormRef.value.$refs['elFormRef'].validate(async (valid) => {
    if (valid) {
      try {
        await Http({ type: type.value, data: formData })
        modalStore['close'] && modalStore['close']()
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
<style lang="">

</style>
