<!--
 * @Author: shen
 * @Date: 2025-09-14 17:31:15
 * @LastEditors: shen
 * @LastEditTime: 2025-09-14 17:35:01
 * @Description:
-->
<script setup lang="ts">
import { ProModal, ProButton } from 'pro-design-vue'
import { Space } from 'ant-design-vue'

import { ref } from 'vue'
const open = ref<boolean>(false)
const open2 = ref<boolean>(false)

const afterOpenChange = (bool: boolean) => {
  console.log('open', bool)
}

const fullScreen = (bool: boolean) => {
  console.log('fullScreen', bool)
}

const showDrawer = () => {
  open.value = true
}

const showDrawer2 = () => {
  open2.value = true
}
</script>

<template>
  <Space>
    <ProButton type="primary" @click="showDrawer">打开对话框</ProButton>
    <ProButton type="primary" @click="showDrawer2">默认全屏</ProButton>
  </Space>
  <ProModal
    v-model:open="open"
    title="对话框标题"
    description="我是对话框的描述信息"
    draggable
    @full-screen="fullScreen"
    @after-open-change="afterOpenChange"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </ProModal>
  <ProModal
    v-model:open="open2"
    title="对话框全屏"
    description="我是对话框的描述信息"
    default-fullscreen
    @full-screen="fullScreen"
    @after-open-change="afterOpenChange"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </ProModal>
</template>
