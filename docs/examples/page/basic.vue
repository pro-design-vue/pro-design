<script setup lang="ts">
import { ref } from 'vue'
import { ProPage, ProButton } from 'pro-design-vue'
import { Space } from 'ant-design-vue'

const activeKey = ref('tab1')
const tabList = ref([
  {
    key: 'tab1',
    tab: 'Tab1',
  },
  {
    key: 'tab2',
    tab: 'Tab2',
  },
])
</script>

<template>
  <ProPage title="页面标题" :tabList v-model:active-key="activeKey">
    <template #extra>
      <Space>
        <ProButton>次要按钮</ProButton>
        <ProButton type="primary">主要按钮</ProButton>
      </Space>
    </template>
    <template #default="{ activeKey }"> 页面内容{{ activeKey }} </template>
    <!-- 页面内容 -->
  </ProPage>
</template>
