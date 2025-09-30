<script setup lang="ts">
import { ref } from 'vue'
import {
  ProTable,
  type ProTableValueEnumType,
  type ProTableProps,
  type ProTableColumnType,
  ProColumnStateType,
} from 'pro-design-vue'
import { Modal } from 'ant-design-vue'

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
    minWidth: 100,
    width: 150,
    maxWidth: 300,
    resizable: true,
    rowDrag: true,
  },
  {
    key: 'info',
    title: '基本信息',
    align: 'center',
    children: [
      {
        title: '年龄',
        dataIndex: 'age',
        resizable: true,
        rowDrag: true,
      },
      {
        title: '性别',
        dataIndex: 'sex',
        valueEnum: SexValueEnum,
        resizable: true,
      },
    ],
  },

  {
    title: '邮箱',
    dataIndex: 'detail.email',
    resizable: true,
  },
  {
    title: '毕业日期',
    dataIndex: 'graduateDate',
    resizable: true,
  },
  // 此列不能拖拽排序
  {
    title: '状态',
    dataIndex: 'status',
    resizable: true,
    valueEnum: StatusValueEnum,
    drag: false,
  },
]

const data: ProTableProps['dataSource'] = []
for (let i = 0; i < 100; i++) {
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

const columnsState: ProColumnStateType = {
  persistenceType: 'localStorage',
  persistenceKey: 'dragable-local',
}

const onRowDragEnd = ({ record, preTargetInfo, nextTargetInfo }) => {
  return new Promise((reslove, reject) => {
    Modal.confirm({
      title: `Do you Want to drag ${record.name} to ${
        preTargetInfo?.record.name || nextTargetInfo?.record.name
      }?`,
      onOk() {
        reslove(true)
      },
      onCancel() {
        reject()
      },
    })
  })
}

const onColumnDragEnd = ({ column, targetColumn }) => {
  return new Promise((reslove, reject) => {
    Modal.confirm({
      title: `Do you Want to drag ${column.title} to ${targetColumn.title}?`,
      onOk() {
        reslove(true)
      },
      onCancel() {
        reject()
      },
    })
  })
}
</script>

<template>
  <ProTable
    bordered
    virtual
    :tool-bar="false"
    :search="false"
    :scroll="{ y: 300 }"
    :pagination="false"
    :dataSource
    :columns
    column-drag
    :columns-state="columnsState"
    @row-drag-end="onRowDragEnd"
    @column-drag-end="onColumnDragEnd"
  >
    <template #rowDragGhost="{ record, icon, preTargetInfo, nextTargetInfo }">
      <component :is="icon"></component>
      <span style="color: red">
        dragging from {{ record.name }} to
        {{ preTargetInfo?.record.name || nextTargetInfo?.record.name }}
      </span>
    </template>
  </ProTable>
</template>
