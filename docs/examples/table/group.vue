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
    customRender: ({ index }) => {
      if (index < 4) {
        return
      }
      return {
        props: {
          colSpan: 5,
        },
      }
    },
  },
  {
    title: '年龄 性别',
    colSpan: 2,
    dataIndex: 'age',
    customRender: ({ index }) => {
      const obj = {
        props: {} as any,
      }
      if (index === 2) {
        obj.props.rowSpan = 2
      }
      // These two are merged into above cell
      if (index === 3) {
        obj.props.rowSpan = 0
      }
      if (index === 4) {
        obj.props.colSpan = 0
      }
      return obj
    },
  },
  {
    title: '性别',
    dataIndex: 'sex',
    colSpan: 0,
    valueEnum: SexValueEnum,
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
for (let i = 0; i < 5; i++) {
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
    bordered
    :search="false"
    :tool-bar="false"
    :scroll="{ y: 300 }"
    :pagination="false"
    :dataSource
    :columns
  >
  </ProTable>
</template>
