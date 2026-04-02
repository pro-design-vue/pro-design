<script setup lang="ts">
import { ref } from 'vue'
import { RadioGroup, RadioButton, Space, Checkbox } from 'ant-design-vue'
import {
  ProTable,
  type ProTableValueEnumType,
  type ProTableProps,
  type ProTableColumnType,
} from 'pro-design-vue'

const SexValueEnum: Record<string, ProTableValueEnumType> = {
  0: { value: '0', text: '未知啊啊啊啊啊' },
  1: { value: '1', text: '男' },
  2: { value: '2', text: '女' },
}
// 配置有color属性，即可生成tag
const StatusValueEnum: Record<string, ProTableValueEnumType> = {
  0: { value: '0', text: '禁用', color: 'error' },
  1: { value: '1', text: '启用', color: 'success' },
}

const stripe = ref(true)
const bordered = ref(true)
const rowHover = ref(false)
const size = ref<ProTableProps['size']>('middle')
const showHeader = ref(true)

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
    ellipsis: true,
    tooltip: true,
    width: 60,
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

const pagination = {
  pageSize: 5,
}
</script>

<template>
  <Space direction="vertical" style="display: flex">
    <RadioGroup v-model:value="size" button-style="solid">
      <RadioButton value="small">小尺寸</RadioButton>
      <RadioButton value="middle">中尺寸</RadioButton>
      <RadioButton value="large">大尺寸</RadioButton>
    </RadioGroup>
    <Space>
      <Checkbox v-model:checked="stripe">显示斑马纹</Checkbox>
      <Checkbox v-model:checked="bordered">显示表格边框</Checkbox>
      <Checkbox v-model:checked="rowHover">显示悬浮效果</Checkbox>
      <Checkbox v-model:checked="showHeader">显示表头</Checkbox>
    </Space>
    <ProTable
      :tool-bar="false"
      :search="false"
      :size
      :stripe
      :bordered
      :showHeader
      :dataSource
      :columns
      :pagination
      :rowHover
    />
  </Space>
</template>
