<script setup lang="ts">
import { ref } from 'vue'
import {
  ProTable,
  ProTableSummaryRow,
  ProTableSummaryCell,
  type ProTableValueEnumType,
  type ProTableProps,
  type ProTableColumnType,
} from 'pro-design-vue'

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
    title: '姓名',
    dataIndex: 'name',
    fixed: 'left',
    width: 150,
  },
  {
    title: '年龄',
    dataIndex: 'age',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    valueEnum: SexValueEnum,
  },
  {
    title: '邮箱',
    dataIndex: 'detail.email',
    ellipsis: true,
  },
  {
    title: '毕业日期',
    dataIndex: 'graduateDate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: StatusValueEnum,
  },
  {
    title: '操作',
    fixed: 'right',
    width: 100,
    dataIndex: 'operation',
  },
]

const data: ProTableProps['dataSource'] = []
for (let i = 0; i < 20; i++) {
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

const dataSource = ref(data)

const customRow = (_, index) => {
  return index % 2 === 1
    ? { style: { background: '#ffa39e' } }
    : { style: { background: '#91d5ff' } }
}
const customCell = ({ rowIndex, column }) => {
  if (column.dataIndex === 'name') {
    return rowIndex < 3
      ? { style: { background: '#f5222d', color: '#fff' } }
      : { style: { background: '#87e8de' } }
  } else if (column.key === 'operation') {
    return { style: { background: '#fffb8f' } }
  }
  return {}
}

const customHeaderCell = (column) => {
  return column.fixed ? { style: { background: '#b7eb8f' } } : {}
}
</script>

<template>
  <ProTable
    :search="false"
    :tool-bar="false"
    :scroll="{ y: 400, x: 1400 }"
    :pagination="false"
    :custom-row="customRow"
    :custom-cell="customCell"
    :dataSource
    :columns
    bordered
    :custom-header-cell="customHeaderCell"
    summary-fixed
  >
    <template #summary>
      <ProTableSummaryRow>
        <ProTableSummaryCell :index="0" style="background-color: #d3adf7">
          总年龄
        </ProTableSummaryCell>
        <ProTableSummaryCell :index="1" style="background-color: #ffadd2; color: #1677ff">
          <template #default="{ total }">
            {{ total }}
          </template>
        </ProTableSummaryCell>
      </ProTableSummaryRow>
      <ProTableSummaryRow>
        <ProTableSummaryCell :index="0" style="background-color: #d3adf7">
          平均年龄
        </ProTableSummaryCell>
        <ProTableSummaryCell :index="1" :col-span="Infinity" style="background-color: #ffadd2">
          <template #default="{ total }"> {{ total / 20 }} </template>
        </ProTableSummaryCell>
        <ProTableSummaryCell
          column-key="operation"
          style="background-color: #ffadd2"
        ></ProTableSummaryCell>
      </ProTableSummaryRow>
    </template>
  </ProTable>
</template>
