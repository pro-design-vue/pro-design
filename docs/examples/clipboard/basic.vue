<script setup lang="ts">
import { ProClipboard, ProButton } from 'pro-design-vue'
import { Space } from 'ant-design-vue'
</script>

<template>
  <Space>
    <ProClipboard text="我是复制的文本">
      <ProButton>点击我复制</ProButton>
    </ProClipboard>
    <ProClipboard text="我是复制的文本" copy-tip="复制" copied-tip="复制好了">
      <ProButton>自定义复制提示</ProButton>
    </ProClipboard>
  </Space>
</template>
