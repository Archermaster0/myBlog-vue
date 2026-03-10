import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useModalStore = defineStore('modal', () => {
  let isShow = ref(false)
  let type = ref('')

  //显示modal
  function open(type) {
    changeType({ type })
    this.isShow = true
  }

  //关闭modal
  function close() {
    this.isShow = false
  }

  //提交modal
  function confirm() {
    console.log('提交成功')
  }

  //修改modal的type类型
  function changeType(payload) {
    type.value = payload.type
  }

  return { type, isShow, open, close, confirm, changeType }
})
