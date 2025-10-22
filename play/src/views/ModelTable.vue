<!--
 * @Author: shen
 * @Date: 2025-07-17 10:11:59
 * @LastEditors: shen
 * @LastEditTime: 2025-09-19 09:37:49
 * @Description:
-->
<script setup lang="ts">
import {
  ProPage,
  ProButton,
  ProDrawer,
  ProModal,
  ProTable,
  ProFieldType,
  ProModalForm,
  type ProTableColumnsType,
  type ProTableRowSelection,
  type ProTableKey,
  type ProTableRequest,
  type ProFormItemType,
} from '@pro-design-vue/components'
import { computed, ref } from 'vue'
import { Space } from 'ant-design-vue'
import { sleep } from '@pro-design-vue/utils'

const columns: ProTableColumnsType = [
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    fieldType: ProFieldType.DIGIT,
  },
  {
    title: 'Column 1',
    dataIndex: 'address',
    fieldType: ProFieldType.SELECT,
    options: [
      { value: '1', text: '男' },
      { value: '2', text: '女' },
    ],
  },
  {
    title: 'Column 2',
    dataIndex: 'address1',
  },
]
const data: any[] = []
for (let i = 0; i < 1000; i++) {
  data.push({
    id: i,
    name: `Edrward ${i}`,
    age: i + 1,
    address: `London Park no. ${i}`,
  })
}
const rowSelection = computed<ProTableRowSelection>(() => {
  return {
    // type: 'radio',
    hideDefaultSelections: true,
    selections: [
      ProTable.SELECTION_ALL,
      ProTable.SELECTION_INVERT,
      ProTable.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys: ProTableKey[] = []
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            if (index % 2 !== 0) {
              return false
            }
            return true
          })
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys: ProTableKey[] = []
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            if (index % 2 !== 0) {
              return true
            }
            return false
          })
        },
      },
    ],
    getCheckboxProps(record) {
      return {
        disabled: record.id === 1,
      }
    },
  }
})

const fetchData: ProTableRequest = async (params, sorters, filter) => {
  // console.log('🚀 ~ constfetchData:ProTableRequest= ~ sorters:', sorters)
  // console.log('🚀 ~ constfetchData:ProTableRequest= ~ filter:', filter)
  // console.log('🚀 ~ constfetchData:ProTableRequest= ~ params:', params)
  await sleep(1000)
  return {
    success: true,
    data: params.status === 'tab2' ? [] : data,
  }
}
</script>

<template>
  <ProTable
    row-key="id"
    :columns="columns"
    :request="fetchData"
    :search="false"
    :card-props="false"
    highlight-select-row
    :options="{
      reload: false,
      setting: false,
      density: false,
    }"
  >
    <template #alertActions>
      <a class="pro-link">批量删除</a>
      <a class="pro-link">导出数据</a>
    </template>
  </ProTable>
</template>
