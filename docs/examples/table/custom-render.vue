<script setup lang="tsx">
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
    title: ({ column }) => {
      return <a>姓名</a>
    },
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
    customRender: ({ record }) => {
      // return <a style={{ color: record.age > 30 ? 'red' : 'green' }}>{record.age}</a>
      return {
        props: {
          style: {
            color: record.age > 30 ? 'red' : 'green',
          },
          class: 'custom-row',
        },
        children: <span>{record.age}</span>,
      }
    },
  },
  {
    title: '邮箱',
    dataIndex: 'detail.email',
    ellipsis: true,
    renderText(text) {
      return `邮箱：${text}`
    },
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
    :scroll="{ y: 400 }"
    :pagination="false"
    :dataSource
    :columns
  >
    <template #headerCell="{ title, column }">
      <template v-if="column.key === 'age'">
        {{ title }}<span style="color: red">（周岁）</span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'age'"> {{ record.age }}周岁 </template>
    </template>
  </ProTable>
</template>
