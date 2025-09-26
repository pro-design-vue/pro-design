<script setup lang="tsx">
import { sleep } from '@pro-design-vue/utils'
import { message } from 'ant-design-vue'
import { ProFieldType, ProForm, type ProFormItemType } from 'pro-design-vue'
import { ref } from 'vue'

const LAYOUT_TYPE_HORIZONTAL = 'horizontal'

const grid = ref(true)
const formLayout = ref<string>(LAYOUT_TYPE_HORIZONTAL)

const formItems: ProFormItemType[] = [
  {
    name: 'layout',
    title: '标签布局',
    fieldType: ProFieldType.RADIO_GROUP,
    options: ['horizontal', 'vertical'],
    initialValue: formLayout.value,
    colProps: {
      span: 20,
    },
    fieldProps: {
      optionType: 'button',
    },
    onChange: (val) => {
      formLayout.value = val
    },
  },
  {
    name: 'grid',
    title: 'grid开关',
    fieldType: ProFieldType.SWITCH,
    options: ['horizontal', 'vertical'],
    initialValue: true,
    colProps: {
      span: 4,
    },
    onChange: (val) => {
      grid.value = val
    },
  },
  {
    name: 'name',
    title: '标题',
    tooltip: '最长为 24 位',
    placeholder: '请输入名称',
  },
  {
    name: 'company',
    title: '姓名',
    colProps: {
      md: 12,
      xl: 8,
    },
  },
  {
    name: 'phone',
    title: '电话',
    colProps: {
      md: 12,
      xl: 8,
    },
  },
  {
    name: 'email',
    title: '邮箱',
    colProps: {
      md: 12,
      xl: 8,
    },
  },
  {
    name: 'address',
    title: '详细的工作地址或家庭住址',
    fieldType: ProFieldType.TEXTAREA,
    colProps: {
      span: 24,
    },
  },
]

const fetchDetail = async (params) => {
  console.log('🚀 ~ request: ~ params:', params)
  await sleep(1500)
  return {
    name: 'Pro Design 有限公司',
    useMode: 'chapter',
  }
}

const handleFinish = async (val) => {
  await sleep(2000)
  console.log(val)
  message.success('提交成功')
}
</script>

<template>
  <ProForm
    :grid="grid"
    :items="formItems"
    :layout="formLayout"
    :request="fetchDetail"
    :params="{ id: '100' }"
    @finish="handleFinish"
  >
  </ProForm>
</template>
