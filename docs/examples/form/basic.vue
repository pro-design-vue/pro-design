<!--
 * @Author: shen
 * @Date: 2025-09-14 22:13:28
 * @LastEditors: shen
 * @LastEditTime: 2025-09-21 16:06:47
 * @Description:
-->
<script setup lang="ts">
import { sleep } from '@pro-design-vue/utils'
import { ProFieldType, ProForm, type ProFormItemType } from 'pro-design-vue'

const formItems: ProFormItemType[] = [
  {
    name: 'INPUT',
    title: '文本',
    // width: 'sm',
  },
  {
    name: 'DIGIT',
    title: '数字',
    fieldType: ProFieldType.DIGIT,
  },
  {
    name: 'DIGIT',
    title: '数字',
    fieldType: ProFieldType.DIGIT,
  },
]

const handleFinish = async (val) => {
  await sleep(2000)
  console.log('🚀 ~ handleReset ~ val:', val)
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
