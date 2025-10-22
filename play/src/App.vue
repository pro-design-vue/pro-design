<!--
 * @Author: shen
 * @Date: 2025-07-17 10:11:59
 * @LastEditors: shen
 * @LastEditTime: 2025-10-20 15:52:08
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
</script>

<template>
  <ProConfigProvider
    :dark
    :token
    pro-prefix-cls="pro1"
    prefix-cls="pro-ant"
    :modal="{
      showFullscreen: true,
      draggable: false,
    }"
    :drawer="{
      showFullscreen: true,
    }"
    :form="{
      // resetOnSubmit: true,
    }"
    :table="{
      // cardBordered: true,
      bordered: true,
      options: {
        fullScreen: false,
      },
      pagination: {
        pageSize: 25,
        pageSizeOptions: ['5', '10', '25', '50'],
        fieldNames: {
          current: 'pageNum',
          pageSize: 'size',
        },
      },
    }"
  >
    <ProButton @click="handleColor">#1677ff</ProButton>
    <ProButton @click="handleColor2">#006be6</ProButton>
    <ProButton @click="handleDark" type="link">暗黑</ProButton>
    <!-- <ProLayout> -->
    <!-- <template #content> -->
    <!-- <div style="background-color: aliceblue"> -->
    <RouterView />
    <!-- </div> -->

    <!-- </template> -->
    <!-- </ProLayout> -->
  </ProConfigProvider>
</template>
