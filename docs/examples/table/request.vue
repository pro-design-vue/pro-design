<script setup lang="ts">
import {
  ProTable,
  ProFieldType,
  type ProTableValueEnumType,
  type ProTableProps,
  type ProTableColumnType,
  type ProTableRequest,
} from 'pro-design-vue'
import { sleep } from '@pro-design-vue/utils'
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
    dataIndex: 'id',
    width: 50,
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
  {
    title: '年龄',
    hideInSearch: true,
    dataIndex: 'age',
    sorter: true,
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
    fieldType: ProFieldType.DATE_RANGE,
    dataIndex: 'graduateDate',
  },
  {
    title: '状态',
    dataIndex: 'status',
    fieldType: ProFieldType.SELECT,
    valueEnum: StatusValueEnum,
    filters: [
      { value: '0', text: '禁用' },
      { value: '1', text: '启用' },
    ],
  },
]

const data: ProTableProps['dataSource'] = []
for (let i = 0; i < 200; i++) {
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

const fetchData: ProTableRequest = async (params, sorters, filter) => {
  console.log('params:', params)
  console.log('filter:', filter)
  console.log('sorters:', sorters)

  // 此处模拟服务返回的数据
  const filterData = data.filter((item) => {
    if (filter?.status?.length) {
      return filter?.status?.includes(item.status)
    }
    return true
  })

  if (sorters?.length) {
    const sorter = sorters[0]
    filterData.sort((a, b) => {
      if (sorter.order === 'asc') {
        return a.age - b.age
      }
      return b.age - a.age
    })
  }

  await sleep(1000)
  // 此处模拟分页
  const startIndex = (params.current! - 1) * params.pageSize!
  const endIndex = startIndex + params.pageSize!
  return {
    success: true,
    data: [...filterData].slice(startIndex, endIndex),
    total: filterData.length,
  }
}
</script>

<template>
  <ProTable
    :columns
    :request="fetchData"
    :sticky="{
      offsetHeader: 64,
    }"
    :tool-bar="false"
    :search="false"
    :pagination="{ pageSize: 5 }"
    :max-height="400"
  >
  </ProTable>
</template>
