<script setup lang="ts">
import { ref } from 'vue'
import { sleep } from '@pro-design-vue/utils'
import { Space } from 'ant-design-vue'
import {
  ProFieldType,
  ProModalForm,
  ProDrawerForm,
  ProButton,
  type ProFormItemType,
} from 'pro-design-vue'

const openModal = ref(false)
const openDrawer = ref(false)

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

const handleInit = (values, action) => {
  console.log('🚀 ~ handleInit ~ values:', values)
  action.setFieldValue('INPUT', '1111')
}
</script>

<template>
  <Space>
    <ProButton type="primary" @click="openModal = true">Modal 展示</ProButton>
    <ProButton type="primary" @click="openDrawer = true">Drawer 展示</ProButton>
  </Space>

  <ProModalForm
    v-model:open="openModal"
    :items="formItems"
    title="新建表单"
    @finish="handleFinish"
    @init="handleInit"
  />
  <ProDrawerForm
    v-model:open="openDrawer"
    :items="formItems"
    title="新建表单"
    @finish="handleFinish"
    @init="handleInit"
  />
</template>
