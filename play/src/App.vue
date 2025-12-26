<!--
 * @Author: shen
 * @Date: 2025-07-17 10:11:59
 * @LastEditors: shen
 * @LastEditTime: 2025-12-25 14:27:14
 * @Description:
-->
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ProConfigProvider, ProButton } from '@pro-design-vue/components'
import { ref } from 'vue'

const token = ref({})

const dark = ref(false)

const handleColor = () => {
  token.value = {
    colorPrimary: 'red',
  }
}

const handleColor2 = () => {
  token.value = {
    colorPrimary: '#006be6',
  }
}

const open = ref(false)
const handleDark = () => {
  dark.value = !dark.value
}

const getPopupContainer = (triggerNode?: HTMLElement) => {
  return (triggerNode?.parentNode || document.body) as HTMLElement
}
</script>

<template>
  <!-- <button @click="handleDark">安内</button> -->
  <ProConfigProvider
    :dark
    :token
    :getPopupContainer
    pro-prefix-cls="pro1"
    prefix-cls="pro-ant"
    :accessCodes="new Set(['aaa', 'bbb'])"
    :modal="{
      showFullscreen: true,
      draggable: false,
    }"
    :drawer="{
      showFullscreen: true,
    }"
    :form="{
      colon: false,
    }"
    :table="{
      // cardBordered: true,
      size: 'small',
      options: {
        // fullScreen: false,
      },
      expandIconType: 'arrow',
      pagination: {
        pageSize: 10,
        pageSizeOptions: ['5', '10', '25', '50'],
        fieldNames: {
          current: 'pageNum',
          pageSize: 'size',
        },
      },
    }"
  >
    <RouterView />
  </ProConfigProvider>
</template>
