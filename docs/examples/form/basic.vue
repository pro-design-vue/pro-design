<script setup lang="ts">
import { sleep } from '@pro-design-vue/utils'
import { ProFieldType, ProForm, type ProFormItemType } from 'pro-design-vue'

const formItems: ProFormItemType[] = [
  {
    name: 'INPUT',
    title: '文本',
    initialValue: '2',
    colSize: 16,
    convertValue: (value) => {
      return value + '1'
    },
  },
  {
    name: 'DIGIT',
    title: '数字',
    fieldType: ProFieldType.DIGIT,
  },
  {
    fieldType: ProFieldType.GROUP,
    grid: false,
    rowProps: {
      gutter: 20,
    },
    // colProps: {
    //   span: 24,
    // },
    children: [
      {
        title: '数字',
        name: 'est',
        fieldType: ProFieldType.DIGIT,
        transform: (value) => {
          return value + '1'
        },
      },
      {
        name: 'DIGIT',
        title: '数字',
        fieldType: ProFieldType.DIGIT,
      },
    ],
  },
]

const handleFinish = async (val) => {
  await sleep(2000)
  console.log(val)
  return true
}
</script>

<template>
  <ProForm
    grid
    :col-props="{ span: 12 }"
    :row-props="{ gutter: 100 }"
    :items="formItems"
    @finish="handleFinish"
  >
  </ProForm>
</template>
