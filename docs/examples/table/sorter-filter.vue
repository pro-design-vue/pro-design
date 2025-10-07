<script setup lang="ts">
import { ref } from 'vue'
import { Input } from 'ant-design-vue'
import {
  dayjs,
  ProTable,
  ProButton,
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
    customFilterDropdown: true,
    onFilter: (value, record) => record.name.includes(value),
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: 100,
    // sorter: (a, b) => a.age - b.age,
    sorter: {
      compare: (a, b) => a.age - b.age,
      multiple: 3,
    },
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 100,
    valueEnum: SexValueEnum,
    filters: [
      { value: '0', text: '未知' },
      { value: '1', text: '男' },
      { value: '2', text: '女' },
    ],
    onFilter: (value: string | number | boolean, record) => {
      return record.sex === value
    },
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
    // sorter: (a, b) => (dayjs(a.graduateDate).isBefore(b.graduateDate, 'day') ? -1 : 1),
    sorter: {
      compare: (a, b) => (dayjs(a.graduateDate).isBefore(b.graduateDate, 'day') ? -1 : 1),
      multiple: 1,
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120,
    filterMultiple: false,
    valueEnum: StatusValueEnum,
    filters: [
      { value: '0', text: '禁用' },
      { value: '1', text: '启用' },
    ],
    onFilter: (value: string | number | boolean, record) => {
      return record.status === value
    },
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
  >
    <template #customFilterDropdown="{ setSelectedKeys, selectedKeys, clearFilters, confirm }">
      <div style="padding: 8px">
        <Input
          placeholder="请输入姓名"
          :value="selectedKeys[0]"
          style="display: block; width: 188px; margin-bottom: 8px"
          @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
        />
        <div style="display: flex; justify-content: space-between">
          <ProButton size="small" type="text" :disabled="!selectedKeys[0]" @click="clearFilters()">
            重置
          </ProButton>
          <ProButton type="primary" size="small" style="margin-right: 8px" @click="confirm()">
            确定
          </ProButton>
        </div>
      </div>
    </template>
  </ProTable>
</template>
