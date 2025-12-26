<!--
 * @Author: shen
 * @Date: 2025-10-22 16:31:15
 * @LastEditors: shen
 * @LastEditTime: 2025-12-25 09:00:19
 * @Description:
-->
<script setup lang="tsx">
import { ProField } from '@pro-design-vue/components'
import { Space } from 'ant-design-vue'
import { ref } from 'vue'
const value = ref('123123123')
const emptyText = <div style={{ color: 'red', display: 'inline-block' }}>---</div>
const onChange = (val, e) => {
  value.value = val
  console.log('🚀 ~ value:', value.value)
  console.log('🚀 ~ onChange ~ e:', value.value)
  // console.log('🚀 ~ onChange ~ e:', e)
}

const sleep = (ms: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, ms)
  })
}

const request = async (...args) => {
  console.log('🚀 ~ request ~ args:', args)
  return [
    { label: '男', value: '1' },
    { label: '女', value: '2' },
  ]
}
</script>

<template>
  <Space style="padding: 100px">
    <ProField :value="value" value-type="select" pro-field-key="11" :request />
    <ProField
      class="aaaa"
      :text="['open', 'closed']"
      style="min-width: 200px"
      :debounceTime="1000"
      value="open"
      value-type="select"
      mode="edit"
      pro-field-key="11"
      :request
      :field-props="{
        showSearch: true,
      }"
      :value-enum="{
        all: { text: '全部', disabled: true, status: 'Default' },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
        },
        processing: {
          text: '解决中',
          status: 'Processing',
        },
      }"
    />
    <ProField
      :value="value"
      mode="edit"
      :empty-text="emptyText"
      placeholder="1111"
      :field-props="{
        suffix: '11',
        prefix: '22',
        autoFocus: true,
      }"
      @change="onChange"
    >
      <!-- <template #render>aa</template> -->
      <template #prefix>prefix</template>
      <template #render-form-item="{ dom }">
        <component :is="dom"></component>
      </template>
    </ProField>
  </Space>
</template>
