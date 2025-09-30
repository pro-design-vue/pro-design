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
    fixed: 'left',
  },
  {
    title: '基本信息',
    align: 'center',
    fixed: 'left',
    children: [
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
        title: '手机号',
        dataIndex: 'phone',
      },
    ],
  },

  {
    title: '邮箱',
    dataIndex: 'detail.email',
  },
  {
    title: '毕业日期',
    dataIndex: 'graduateDate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    fixed: 'right',
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
    phone: '133****3232',
    detail: {
      email: ['w.cezkdudy@qq.com', 'r.nmgw@qq.com', 'p.cumx@qq.com'][i % 3],
    },
    graduateDate: ['2024-01-01', '2012-02-01', '2025-03-01', '2002-04-01'][i % 4],
  })
}

const dataSource = ref(data)

const pagination = {
  pageSize: 5,
}
</script>

<template>
  <ProTable
    bordered
    :tool-bar="false"
    :search="false"
    :dataSource
    :columns
    :pagination
    :scroll="{ x: 1200 }"
  />
</template>
