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
    title: '姓名',
    dataIndex: 'name',
    width: 150,
    fixed: 'left',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 100,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 100,
    valueEnum: SexValueEnum,
  },
  {
    title: '邮箱',
    width: 150,
    dataIndex: 'detail.email',
  },
  {
    title: '毕业日期',
    width: 150,
    dataIndex: 'graduateDate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    valueEnum: StatusValueEnum,
  },
  ...new Array(200).fill(1).map((_, index) => ({
    title: `其他 ${index + 1}`,
    dataIndex: 'age',
    key: `other_${index + 1}`,
    width: 100,
  })),
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
  />
</template>
