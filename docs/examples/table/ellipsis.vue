<script setup lang="ts">
import { ref } from 'vue'
import {
  ProTable,
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
    title: '姓名很长很长很长很长很长很长很长很长',
    dataIndex: 'name',
    headerTooltip: true,
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
    headerTooltip: '常用邮箱',
    ellipsis: true,
    tooltip: { title: ({ value }) => `邮箱：${value}`, placement: 'topLeft' },
  },
  {
    title: '地址',
    dataIndex: 'address',
    ellipsis: { line: 2, showTitle: false },
    tooltip: true,
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
]

const data: ProTableProps['dataSource'] = []
for (let i = 0; i < 20; i++) {
  data.push({
    id: i + 1,
    name: ['王五', '张三', '李四'][i % 3],
    age: [20, 31, 18, 45][i % 4],
    status: (i % 3) + '',
    sex: ['1', '2', '0'][i % 3],
    address: [
      '吉林省长春市高新区某某大街某某街道1008号',
      '黑龙江省哈尔滨香坊区某某大街某某街道1008号',
      '辽宁省沈阳市某某大街某某街道1008号',
    ][i % 3],
    detail: {
      email: ['wwwwww.cezkdudy@qq.com', 'rrrrrrr.nmgw@qq.com', 'p.cumx@qq.com'][i % 3],
    },
    graduateDate: ['2024-01-01', '2012-02-01', '2025-03-01', '2002-04-01'][i % 4],
  })
}

const dataSource = ref(data)
</script>

<template>
  <ProTable
    virtual
    :search="false"
    :tool-bar="false"
    :scroll="{ y: 300 }"
    :pagination="false"
    :dataSource
    :columns
  >
  </ProTable>
</template>
