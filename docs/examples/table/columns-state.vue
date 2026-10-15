<script setup lang="ts">
import { ref } from 'vue'
import { ProTable, type ProTableColumnType } from 'pro-design-vue'

const columns: ProTableColumnType[] = [
  { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 100 },
  { title: '性别', dataIndex: 'sex', key: 'sex', width: 80 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 200 },
  { title: '电话', dataIndex: 'phone', key: 'phone', width: 150 },
  { title: '地址', dataIndex: 'address', key: 'address', width: 300 },
]

const dataSource = ref(
  Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: ['张三', '李四', '王五'][i % 3],
    age: [25, 30, 35, 40][i % 4],
    sex: ['男', '女'][i % 2],
    email: `user${i + 1}@example.com`,
    phone: `138${String(i).padStart(8, '0')}`,
    address: `某某路 ${i + 1} 号`,
  })),
)
</script>

<template>
  <ProTable
    title="列状态持久化"
    :columns="columns"
    :data-source="dataSource"
    :search="false"
    bordered
    row-key="id"
    :columns-state="{
      persistenceType: 'localStorage',
      persistenceKey: 'table-columns-state-demo',
    }"
    :max-height="400"
  >
    <template #toolbar>列宽和顺序调整后刷新页面将保持。</template>
  </ProTable>
</template>
