<!--
 * @Author: shen
 * @Date: 2025-09-14 18:19:59
 * @LastEditors: shen
 * @LastEditTime: 2025-09-14 20:53:24
 * @Description:
-->
<script setup lang="ts">
import { ref } from 'vue'
import { ProTable } from 'pro-design-vue'

interface DataItem {
  key: number
  name: string
  age: number
  address: string
}

const columns = ref([
  {
    title: 'Full Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Column 1',
    key: 'address1',
    dataIndex: 'address',
  },
  {
    title: 'Column 2',
    key: 'address2',
    dataIndex: 'address',
  },
])

const data: DataItem[] = []
for (let i = 0; i < 100000; i++) {
  data.push({
    key: i,
    name: `Edrward ${i}`,
    age: i + 1,
    address: `London Park no. ${i}`,
  })
}

const dataSource = ref(data)
</script>

<template>
  <ProTable
    row-key="key"
    virtual
    :tool-bar="false"
    :scroll="{ y: 400 }"
    :pagination="false"
    :dataSource
    :columns
  />
</template>
