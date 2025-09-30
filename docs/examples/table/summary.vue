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
    bordered
    summary-fixed
  >
    <template #summary>
      <ProTableSummaryRow>
        <ProTableSummaryCell :index="0"> 总年龄 </ProTableSummaryCell>
        <ProTableSummaryCell :index="1">
          <template #default="{ total }">
            {{ total }}
          </template>
        </ProTableSummaryCell>
      </ProTableSummaryRow>
      <ProTableSummaryRow>
        <ProTableSummaryCell :index="0"> 平均年龄 </ProTableSummaryCell>
        <ProTableSummaryCell :index="1">
          <template #default="{ total }"> {{ total / 20 }} </template>
        </ProTableSummaryCell>
      </ProTableSummaryRow>
    </template>
  </ProTable>
</template>
