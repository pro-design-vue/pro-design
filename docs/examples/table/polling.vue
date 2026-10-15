<script setup lang="ts">
import { ProTable, type ProTableColumnType, type ProTableRequest } from 'pro-design-vue'
import { sleep } from '@pro-design-vue/utils'

const columns: ProTableColumnType[] = [
  { title: '序号', dataIndex: 'id', key: 'id', width: 80 },
  { title: '股票名称', dataIndex: 'name', key: 'name', width: 120 },
  { title: '最新价', dataIndex: 'price', key: 'price', width: 100 },
  { title: '涨跌幅', dataIndex: 'change', key: 'change', width: 100 },
  { title: '成交量', dataIndex: 'volume', key: 'volume', width: 120 },
  { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 180 },
]

const fetchData: ProTableRequest = async () => {
  await sleep(300)
  const data = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: ['平安银行', '万科A', '中国平安', '格力电器', '贵州茅台'][i % 5],
    price: `¥${(Math.random() * 200 + 10).toFixed(2)}`,
    change: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 10).toFixed(2)}%`,
    volume: Math.floor(Math.random() * 1000000),
    updateTime: new Date().toLocaleTimeString(),
  }))
  return { success: true, data }
}
</script>

<template>
  <ProTable
    title="股票行情（自动轮询 3 秒）"
    :columns="columns"
    :request="fetchData"
    :tool-bar="false"
    :search="false"
    bordered
    :polling="3000"
    :pagination="false"
  />
</template>
