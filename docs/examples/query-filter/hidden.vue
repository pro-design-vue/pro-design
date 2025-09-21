<script setup lang="ts">
import { ProFieldType, ProQueryFilter, type ProFormItemType } from 'pro-design-vue'

const formItems: ProFormItemType[] = [
  {
    name: 'name',
    title: '应用名称',
  },
  {
    name: 'createDate',
    title: '创建时间',
    fieldType: ProFieldType.DATE,
  },
  {
    name: 'status',
    title: '应用状态',
  },
  {
    name: 'replyDate',
    title: '响应日期',
  },
  {
    name: 'payDate',
    title: '支付日期',
    colSize: 2,
    fieldType: ProFieldType.DATE_RANGE,
  },
]

const handleValueChange = (val) => {
  console.log(val)
}
</script>

<template>
  <ProQueryFilter
    :items="formItems"
    :span="6"
    :submitter="false"
    @values-change="handleValueChange"
  />
</template>
