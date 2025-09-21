<script setup lang="ts">
import { sleep } from '@pro-design-vue/utils'
import { Space } from 'ant-design-vue'
import {
  ProForm,
  ProFieldType,
  ProDrawerForm,
  ProButton,
  type ProFormItemType,
} from 'pro-design-vue'

const formItems: ProFormItemType[] = [
  {
    name: 'INPUT',
    title: '文本',
    width: 'sm',
  },
  {
    name: 'DIGIT',
    title: '数字',
    fieldType: ProFieldType.DIGIT,
  },
]

const handleFinish = async (val) => {
  await sleep(2000)
  console.log(val)
  return true
}
</script>

<template>
  <Space>
    <ProDrawerForm :items="formItems" title="新建Drawer表单" @finish="handleFinish">
      <template #trigger>
        <ProButton type="primary">新建表单</ProButton>
      </template>
    </ProDrawerForm>
    <ProForm layout-type="DrawerForm" :items="formItems" @finish="handleFinish">
      <template #title>新建Drawer表单Slot</template>
      <template #trigger>
        <ProButton type="primary">新建表单(ProForm)</ProButton>
      </template>
    </ProForm>
  </Space>
</template>
