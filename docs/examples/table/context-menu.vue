<script setup lang="ts">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { ProTable, type ProTableColumnType } from 'pro-design-vue'

const columns: ProTableColumnType[] = [
  { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
  { title: '年龄', dataIndex: 'age', key: 'age', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '邮箱', dataIndex: 'email', key: 'email', width: 200 },
  { title: '操作', dataIndex: 'action', key: 'action', width: 150 },
]

const dataSource = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: ['张三', '李四', '王五'][i % 3],
    age: [25, 30, 35, 40][i % 4],
    status: ['启用', '禁用'][i % 2],
    email: `user${i + 1}@example.com`,
    action: '...',
  })),
)
</script>

<template>
  <ProTable
    title="右键菜单"
    :columns="columns"
    :data-source="dataSource"
    :search="false"
    :tool-bar="false"
    bordered
    row-key="id"
    has-contextmenu-popup
    :max-height="400"
  >
    <template #contextmenuPopup="{ record, hidePopup }">
      <div style="min-width: 120px; padding: 8px 12px" v-if="record">
        <div
          style="padding: 6px 8px; cursor: pointer; border-radius: 4px"
          class="hover:bg-gray-100"
          @click="
            message.info(`查看: ${record!.name}`)
            hidePopup()
          "
        >
          查看详情
        </div>
        <div
          style="padding: 6px 8px; cursor: pointer; border-radius: 4px"
          class="hover:bg-gray-100"
          @click="
            message.success(`编辑: ${record!.name}`)
            hidePopup()
          "
        >
          编辑
        </div>
        <div
          style="padding: 6px 8px; color: #ff4d4f; cursor: pointer; border-radius: 4px"
          class="hover:bg-gray-100"
          @click="
            message.warning(`删除: ${record!.name}`)
            hidePopup()
          "
        >
          删除
        </div>
      </div>
    </template>
  </ProTable>
</template>
