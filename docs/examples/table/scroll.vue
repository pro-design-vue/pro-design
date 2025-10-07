<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { Space } from 'ant-design-vue'
import {
  ProTable,
  ProButton,
  type ProTableValueEnumType,
  type ProTableProps,
  type ProTableColumnType,
  type ProTableInstance,
  ScrollPosition,
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

const tableRef = useTemplateRef<ProTableInstance>('table')
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
    fixed: 'left',
    width: 100,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    valueEnum: SexValueEnum,
    width: 100,
  },
  {
    title: '邮箱',
    dataIndex: 'detail.email',
    width: 150,
  },
  {
    title: '毕业日期',
    dataIndex: 'graduateDate',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: StatusValueEnum,
    width: 150,
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
    name: ['王五', '张三', '李四'][i % 3] + (i + 1),
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

const handleClick = (pos: ScrollPosition, smooth = false) => {
  tableRef.value?.scrollTo(pos, smooth ? 'smooth' : 'auto')
}
</script>

<template>
  <Space direction="vertical" style="display: flex">
    <Space wrap>
      <ProButton @click="handleClick({ left: 0 }, true)">left: 0</ProButton>
      <ProButton @click="handleClick({ top: 99 }, true)">top: 0</ProButton>
      <ProButton @click="handleClick({ left: 500 }, true)">left: 500</ProButton>
      <ProButton @click="handleClick({ top: 2000 }, true)">top: 500</ProButton>
      <ProButton @click="handleClick({ left: 1000, top: 8000 }, true)"
        >left: 1000, top: 8000</ProButton
      >
      <ProButton @click="handleClick({ columnIndex: 5 }, true)">columnIndex: 5</ProButton>
      <ProButton @click="handleClick({ columnKey: 'graduateDate' }, true)"
        >columnKey: graduateDate</ProButton
      >
      <ProButton @click="handleClick({ rowKey: 99 }, true)">rowKey: 99</ProButton>
    </Space>
    <ProTable
      ref="table"
      virtual
      :search="false"
      :tool-bar="false"
      :scroll="{ y: 300 }"
      :pagination="false"
      :dataSource
      :columns
    />
  </Space>
</template>
