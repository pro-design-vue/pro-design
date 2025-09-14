<script setup lang="ts">
import { ProDrawer, ProButton } from 'pro-design-vue'
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
    <ProButton type="primary" @click="showDrawer">打开抽屉</ProButton>
    <ProButton type="primary" @click="showDrawer2">默认全屏</ProButton>
  </Space>
  <ProDrawer
    v-model:open="open"
    title="抽屉标题"
    description="我是抽屉的描述信息"
    @full-screen="fullScreen"
    @after-open-change="afterOpenChange"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </ProDrawer>
  <ProDrawer
    v-model:open="open2"
    title="全屏抽屉"
    description="我是抽屉的描述信息"
    default-fullscreen
    @full-screen="fullScreen"
    @after-open-change="afterOpenChange"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </ProDrawer>
</template>
