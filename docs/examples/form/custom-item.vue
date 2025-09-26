<!--
 * @Author: shen
 * @Date: 2025-09-26 15:04:31
 * @LastEditors: shen
 * @LastEditTime: 2025-09-26 15:28:05
 * @Description:
-->
<script setup lang="ts">
import {
  ProTable,
  type ProTableColumnsType,
  type ProTableRowSelection,
  type ProFormItemType,
} from 'pro-design-vue'
import { type PropType } from 'vue'
import { Form } from 'ant-design-vue'

defineProps({
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  onChange: {
    type: Function as PropType<ProFormItemType['onChange']>,
  },
})
const emit = defineEmits(['change', 'update:value'])

const formItemContext = Form.useInjectFormItemContext()

const columns: ProTableColumnsType = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 100,
  },
  {
    title: '名称',
    dataIndex: 'name',
    width: 200,
  },
]

const dataSource = [
  { id: '1', name: 'pro design' },
  { id: '2', name: 'pro design admin' },
  { id: '3', name: 'pro design vue' },
]

const rowSelection: ProTableRowSelection = {
  type: 'checkbox',
  onChange(selectedRowKeys) {
    emit('change', selectedRowKeys)
    emit('update:value', selectedRowKeys)
    formItemContext.onFieldChange()
  },
}
</script>

<template>
  <ProTable
    :selected-row-keys="value"
    :row-selection="rowSelection"
    :columns="columns"
    :tool-bar="false"
    :card-props="false"
    :pagination="false"
    :data-source="dataSource"
  >
  </ProTable>
</template>

<style scoped lang="less"></style>
