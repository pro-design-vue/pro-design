## 基础表格（静态数据）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ProTable, type ProTableColumnType, type ProTableValueEnumType } from 'pro-design-vue'

const SexValueEnum: Record<string, ProTableValueEnumType> = {
  0: { value: '0', text: '未知' },
  1: { value: '1', text: '男' },
  2: { value: '2', text: '女' },
}

const StatusValueEnum: Record<string, ProTableValueEnumType> = {
  0: { value: '0', text: '禁用', color: 'error' },
  1: { value: '1', text: '启用', color: 'success' },
}

const columns: ProTableColumnType[] = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' },
  { title: '性别', dataIndex: 'sex', valueEnum: SexValueEnum, width: 60 },
  { title: '邮箱', dataIndex: 'detail.email' },
  { title: '状态', dataIndex: 'status', valueEnum: StatusValueEnum },
]

const dataSource = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: ['王五', '张三', '李四'][i % 3],
    age: [20, 31, 18, 45][i % 4],
    status: `${i % 2}`,
    sex: `${i % 3}`,
    detail: { email: `user${i}@example.com` },
  })),
)
</script>

<template>
  <ProTable
    :tool-bar="false"
    :search="false"
    :columns
    :dataSource
    :pagination="{ pageSize: 5 }"
    stripe
    bordered
  />
</template>
```

## 远程加载数据

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ProTable, type ProTableColumnType } from 'pro-design-vue'
import type { ProTableExposeType } from 'pro-design-vue'

const tableRef = ref<ProTableExposeType>()

const columns: ProTableColumnType[] = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age', sorter: true },
  { title: '邮箱', dataIndex: 'email' },
  { title: '创建时间', dataIndex: 'createTime', valueType: 'dateTime' },
]

const request = async (params: any, sorters: any, filter: any) => {
  // params: { current, pageSize, keyword, ... }
  // sorters: [{ field, order }]
  // filter: { fieldName: [values] }
  const response = await fetch('/api/users', { method: 'POST', body: JSON.stringify(params) })
  const result = await response.json()
  return {
    data: result.records,
    success: true,
    total: result.total,
  }
}
</script>

<template>
  <ProTable ref="tableRef" :columns :request row-key="id" stripe />
</template>
```

## 查询表单

```vue
<script setup lang="ts">
import type { ProTableColumnType } from 'pro-design-vue'
import { ProFieldType } from 'pro-design-vue'

const columns: ProTableColumnType[] = [
  { title: '姓名', dataIndex: 'name', hideInSearch: false },
  { title: '年龄', dataIndex: 'age', hideInSearch: false, fieldType: ProFieldType.DIGIT },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: {
      0: { text: '禁用' },
      1: { text: '启用' },
    },
    hideInSearch: false,
    fieldType: ProFieldType.SELECT,
  },
  { title: '邮箱', dataIndex: 'email' },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    hideInSearch: false,
    fieldType: ProFieldType.DATE_RANGE,
  },
]
</script>

<template>
  <ProTable
    :columns
    :request="request"
    row-key="id"
    :search="{
      labelWidth: 80,
      resetOnSubmit: true,
    }"
  />
</template>
```

## 工具栏

```vue
<script setup lang="ts">
import type { ProTableColumnType } from 'pro-design-vue'

const columns: ProTableColumnType[] = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' },
]

const options = {
  density: true, // 显示密度切换
  reload: true, // 显示刷新按钮
  setting: true, // 显示列设置
  search: true, // 显示搜索按钮（切换查询表单显示）
}
</script>

<template>
  <ProTable :columns :request="request" :options>
    <!-- 工具栏左侧操作按钮 -->
    <ProButton type="primary">新建</ProButton>
    <ProButton>导出</ProButton>
  </ProTable>
</template>
```

## 虚拟滚动

```vue
<script setup lang="ts">
import type { ProTableColumnType } from 'pro-design-vue'

const columns: ProTableColumnType[] = [
  { title: '序号', dataIndex: 'index', width: 80 },
  { title: '列1', dataIndex: 'col1', width: 120 },
  { title: '列2', dataIndex: 'col2', width: 120 },
  // ...更多列
]
</script>

<template>
  <ProTable
    :columns
    :dataSource="largeDataSet"
    :tool-bar="false"
    :search="false"
    :pagination="false"
    :scroll="{ y: 400 }"
    virtual
  />
</template>
```

## 树形表格

```vue
<script setup lang="ts">
import type { ProTableColumnType } from 'pro-design-vue'

const columns: ProTableColumnType[] = [
  { title: '名称', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' },
  { title: '地址', dataIndex: 'address' },
]

const dataSource = [
  {
    id: 1,
    name: '父节点1',
    age: 60,
    address: '杭州市',
    children: [
      { id: 11, name: '子节点1-1', age: 30, address: '西湖区' },
      { id: 12, name: '子节点1-2', age: 28, address: '滨江区' },
    ],
  },
  {
    id: 2,
    name: '父节点2',
    age: 50,
    address: '北京市',
    children: [{ id: 21, name: '子节点2-1', age: 25, address: '朝阳区' }],
  },
]
</script>

<template>
  <ProTable :columns :dataSource :tool-bar="false" :search="false" row-key="id" />
</template>
```

## 行选择

```vue
<script setup lang="ts">
import type { ProTableColumnType } from 'pro-design-vue'

const columns: ProTableColumnType[] = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' },
]

const rowSelection = {
  type: 'checkbox' as const,
  preserveSelectedRowKeys: true,
}
</script>

<template>
  <ProTable
    :columns
    :dataSource
    :rowSelection
    :tool-bar="false"
    highlight-select-row
    always-show-alert
  >
    <!-- alert 操作区域 -->
    <template #alertActions="{ selectedRowKeys, cleanSelected }">
      <a @click="cleanSelected">取消选择</a>
      <ProButton type="primary" @click="batchDelete(selectedRowKeys)">批量删除</ProButton>
    </template>
  </ProTable>
</template>
```

## 列拖拽 / 列宽调整

```vue
<template>
  <ProTable
    :columns
    :request="request"
    row-key="id"
    column-drag
    column-resizable
    :columns-state="{
      persistenceKey: 'user-table',
      persistenceType: 'localStorage',
    }"
  />
</template>
```
