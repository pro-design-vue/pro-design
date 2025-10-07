<script setup lang="ts">
import { ref } from 'vue'
import { Space } from 'ant-design-vue'
import {
  ProTable,
  type ProTableValueEnumType,
  type ProTableProps,
  type ProTableColumnType,
  type ProTableKey,
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
      email: ['wwwwww.cezkdudy@qq.com', 'rrrrrrr.nmgw@qq.com', 'p.cumx@qq.com'][i % 3],
    },
    graduateDate: ['2024-01-01', '2012-02-01', '2025-03-01', '2002-04-01'][i % 4],
  })
}

const dataSource = ref(data)

const rowSelection: ProTableProps['rowSelection'] = {
  // type: 'radio',
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
    virtual
    :search="false"
    :tool-bar="false"
    :scroll="{ y: 300 }"
    :pagination="false"
    :dataSource
    :columns
    :rowSelection
    highlightSelectRow
  >
    <template #alertInfo="{ selectedRowKeys, onCleanSelected }">
      <span>
        已选 {{ selectedRowKeys.length }} 项
        <a style="margin-inline-start: 8px" @click="onCleanSelected"> 取消选择 </a>
      </span>
    </template>
    <template #alertActions>
      <Space>
        <a>批量删除</a>
        <a>导出数据</a>
      </Space>
    </template>
  </ProTable>
</template>
