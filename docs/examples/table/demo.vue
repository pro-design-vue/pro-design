<script setup lang="ts">
import {
  ProTable,
  ProButton,
  ProFieldType,
  type ProTableValueEnumType,
  type ProTableProps,
  type ProTableColumnType,
  type ProTableRequest,
  type ProTableKey,
} from 'pro-design-vue'
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import { sleep } from '@pro-design-vue/utils'
const SexValueEnum: Record<string, ProTableValueEnumType> = {
  0: { value: '0', text: '未知' },
  1: { value: '1', text: '男' },
  2: { value: '2', text: '女' },
}
// 配置有color属性，即可生成tag
const StatusValueEnum: Record<string, ProTableValueEnumType> = {
  0: { value: '0', text: '禁用', color: 'error' },
  1: { value: '1', text: '启用', color: 'success' },
}

const columns: ProTableColumnType[] = [
  {
    dataIndex: 'index',
    width: 50,
    hideInSetting: true,
    hideInSearch: true,
    renderText(text, record, rowIndex) {
      return rowIndex + 1
    },
  },
  {
    title: '姓名',
    dataIndex: 'name',
    disable: true,
    rules: [{ required: true, message: '请输入姓名' }],
  },
  {
    title: '年龄',
    hideInSearch: true,
    dataIndex: 'age',
    sorter: true,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    hideInSearch: true,
    valueEnum: SexValueEnum,
    filters: [
      { value: '0', text: '未知' },
      { value: '1', text: '男' },
      { value: '2', text: '女' },
    ],
  },
  {
    title: '邮箱',
    hideInSearch: true,
    dataIndex: 'detail.email',
  },
  {
    title: '毕业日期',
    fieldType: ProFieldType.DATE_RANGE,
    dataIndex: 'graduateDate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    fieldType: ProFieldType.SELECT,
    valueEnum: StatusValueEnum,
    filters: [
      { value: '0', text: '禁用' },
      { value: '1', text: '启用' },
    ],
    options: [
      { value: '0', text: '禁用' },
      { value: '1', text: '启用' },
    ],
  },
]

const data: ProTableProps['dataSource'] = []
for (let i = 0; i < 2000; i++) {
  data.push({
    id: i + 1,
    name: ['王五', '张三', '李四'][i % 3],
    age: [20, 31, 18, 45][i % 4],
    status: (i % 3) + '',
    sex: ['1', '2', '0'][i % 3],
    detail: {
      email: ['w.cezkdudy@qq.com', 'r.nmgw@qq.com', 'p.cumx@qq.com'][i % 3],
    },
    graduateDate: ['2024-01-01', '2012-02-01', '2025-03-01', '2002-04-01'][i % 4],
  })
}

const fetchData: ProTableRequest = async (params, sorters, filter) => {
  console.log('params:', params)
  console.log('filter:', filter)
  console.log('sorters:', sorters)
  await sleep(1000)
  return {
    success: true,
    data,
  }
}

const rowSelection: ProTableProps['rowSelection'] = {
  onChange: (selectedRowKeys: ProTableKey[], selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === '王五', // Column configuration not to be checked
    name: record.name,
  }),
}
</script>

<template>
  <ProTable
    title="高级表格"
    :columns
    :request="fetchData"
    card-bordered
    :sticky="{
      offsetHeader: 64,
    }"
    :row-selection="rowSelection"
    :pagination="{ pageSize: 5 }"
    :max-height="400"
  >
    <template #toolbarActions>
      <ProButton type="primary">
        <template #icon><PlusOutlined /></template>
        新建
      </ProButton>
      <ProButton>
        <template #icon><EllipsisOutlined /></template>
      </ProButton>
    </template>
  </ProTable>
</template>
