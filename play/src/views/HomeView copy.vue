<!--
 * @Author: shen
 * @Date: 2025-07-17 10:11:59
 * @LastEditors: shen
 * @LastEditTime: 2025-09-23 10:35:36
 * @Description:
-->
<script setup lang="ts">
import {
  ProPage,
  ProButton,
  ProDrawer,
  ProModal,
  ProTable,
  ProFieldType,
  ProModalForm,
  type ProTableColumnsType,
  type ProTableRowSelection,
  type ProTableKey,
  type ProTableRequest,
  type ProFormItemType,
} from '@pro-design-vue/components'
import { computed, ref } from 'vue'
import { Space } from 'ant-design-vue'
import { sleep } from '@pro-design-vue/utils'
import { FullscreenOutlined, EllipsisOutlined } from '@ant-design/icons-vue'

const openDrawer = ref(false)
const openModal = ref(false)
const params = ref({
  tab: 'tab1',
})

const columns: ProTableColumnsType = [
  {
    title: '你的标题太长了会被缩进',
    dataIndex: 'name',
    fixed: 'left',
    width: 150,
    rowDrag: ({ record }) => {
      return record.id !== 1
    },
    headerTooltip: '你的标题太长了会被缩进',
    key: 'name',
    initialValue: '11',
    resizable: true,
    filters: [
      {
        text: 'aa',
        value: '22',
      },
    ],
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    fixed: 'left',
    fieldType: ProFieldType.DIGIT,
    sorter: (a, b) => a.age - b.age,
    width: 100,
  },
  {
    title: 'Column 1',
    dataIndex: 'address',
    align: 'center',
    fieldType: ProFieldType.SELECT,
    options: [
      { value: '1', text: '男' },
      { value: '2', text: '女' },
    ],
  },
  {
    title: 'Column 2',
    dataIndex: 'address1',
  },
  // {
  //   title: 'Column 3',
  //   hideInSearch: true,
  //   dataIndex: 'address',
  // },
  // {
  //   title: 'Column 4',
  //   hideInSearch: true,
  //   dataIndex: 'address',
  // },
  // { title: 'Column 5', dataIndex: 'address', hideInSearch: true },
  {
    title: 'Action',
    key: 'operation',
    fixed: 'right',
    hideInSearch: true,
    width: 100,
  },
]
const data: any[] = []
for (let i = 0; i < 1000; i++) {
  data.push({
    id: i,
    name: `Edrward ${i}`,
    age: i + 1,
    address: `London Park no. ${i}`,
  })
}
const pagination = ref({
  pageSize: 20,
})
const rowSelection = computed<ProTableRowSelection>(() => {
  return {
    // type: 'radio',
    hideDefaultSelections: true,
    selections: [
      ProTable.SELECTION_ALL,
      ProTable.SELECTION_INVERT,
      ProTable.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys: ProTableKey[] = []
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            if (index % 2 !== 0) {
              return false
            }
            return true
          })
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys: ProTableKey[] = []
          newSelectedRowKeys = changableRowKeys.filter((_key, index) => {
            if (index % 2 !== 0) {
              return true
            }
            return false
          })
        },
      },
    ],
    getCheckboxProps(record) {
      return {
        disabled: record.id === 1,
      }
    },
  }
})

const fetchData: ProTableRequest = async (params, sorters, filter) => {
  // console.log('🚀 ~ constfetchData:ProTableRequest= ~ sorters:', sorters)
  // console.log('🚀 ~ constfetchData:ProTableRequest= ~ filter:', filter)
  // console.log('🚀 ~ constfetchData:ProTableRequest= ~ params:', params)
  await sleep(1000)
  return {
    success: true,
    data: params.status === 'tab2' ? [] : data,
  }
}

const beforeSearchSubmit = (values) => {
  console.log('🚀 ~ values:', values)
  return {
    ...values,
    aaa: '12312312',
  }
}

const tabList = ref([
  {
    key: 'tab1',
    tab: '全部',
  },
  {
    key: 'tab2',
    tab: '未激活',
  },
])

const formItems: ProFormItemType[] = [
  {
    name: 'name',
    title: '名称',
    rules: [{ required: true, message: '请输入名称', trigger: 'change' }],
  },
]
</script>

<template>
  <ProPage title="我是页面标题">
    <template #extra>
      <Space>
        <ProModalForm
          grid
          :width="600"
          title="创建"
          :items="formItems"
          :col-props="{ span: 24 }"
          :modal-props="{ destroyOnClose: true }"
          layout="horizontal"
        >
          <template #trigger>
            <ProButton type="primary">创建用户</ProButton>
          </template>
        </ProModalForm>
        <ProButton type="primary" @click="openDrawer = true">打开抽屉</ProButton>
        <ProButton type="primary" @click="openModal = true">打开对话框</ProButton>
      </Space>
    </template>
    <template #default="{ activeKey, offset }">
      <ProTable
        v-model:pagination="pagination"
        :columns="columns"
        :params="params"
        :sticky="{
          offsetHeader: offset.top,
        }"
        :paginationSticky="{
          offsetBottom: offset.bottom,
        }"
        :polling="0"
        :request="fetchData"
        title="高级表格"
        sub-title="这里是子标题"
        tooltip="这是一个标题提示"
        column-drag
        :beforeSearchSubmit
        :options="{
          search: {
            value: '111',
          },
        }"
        :search="{
          cardProps: {
            activeTabKey: 'tab1',
            tabList: [
              {
                key: 'tab1',
                tab: '全部',
              },
              {
                key: 'tab2',
                tab: '未激活',
              },
            ],
          },
          tabName: 'status',
          resetOnSubmit: true,
          layout: 'horizontal',
        }"
        :scroll="{ x: 1500 }"
        :row-selection="rowSelection"
      >
        <template #alertActions>
          <a class="pro-link">批量删除</a>
          <a class="pro-link">导出数据</a>
        </template>
        <template #toolbarActions>
          <ProButton type="primary" :icon="FullscreenOutlined">
            <!-- <template #icon><FullscreenOutlined /></template> -->
            创建应用{{ activeKey }}
          </ProButton>
          <ProButton>
            <template #icon>
              <EllipsisOutlined />
            </template>
          </ProButton>
          <FullscreenOutlined style="font-size: 16px" />
        </template>
      </ProTable>
    </template>
  </ProPage>
  <ProDrawer title="抽屉" v-model:open="openDrawer">内容</ProDrawer>
  <ProModal title="对话框" v-model:open="openModal">内容</ProModal>
</template>
