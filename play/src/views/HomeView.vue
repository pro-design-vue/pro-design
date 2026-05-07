<script setup lang="ts">
import {
  ProTable,
  ProButton,
  ProFieldType,
  ProModal,
  ProDrawer,
  ProPage,
  ProModalForm,
  type ProTableValueEnumType,
  type ProTableProps,
  type ProTableColumnType,
  type ProTableRequest,
  type ProTableKey,
  type ProTableDensitySize,
  type ProFormItemType,
  type ProColumnStateType,
  type ProTableInstance,
} from '@pro-design-vue/components'
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import { sleep } from '@pro-design-vue/utils'
import { ref, useTemplateRef } from 'vue'
import PerfOverlay from './PerfOverlay.vue'

const tableRef = useTemplateRef<ProTableInstance>('table')
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
    dataIndex: 'index',
    width: 100,
    hideInSetting: true,
    hideInSearch: true,
    renderText(text, record, rowIndex) {
      return rowIndex + 1
    },
  },
  {
    title: '姓名',
    dataIndex: 'name',
    disable: true,
    minWidth: 100,
    fieldProps: {
      prefix: 'aaa',
    },
  },
  {
    title: '年龄',
    minWidth: 100,
    hideInSearch: true,
    dataIndex: 'age',
    sorter: true,
    resizable: true,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    minWidth: 100,
    hideInSearch: true,
    valueEnum: SexValueEnum,
    filters: [
      { value: '0', text: '未知' },
      { value: '1', text: '男' },
      { value: '2', text: '女' },
    ],
  },
  {
    title: '邮箱',
    hideInSearch: true,
    minWidth: 100,
    ellipsis: true,
    renderText: () => '11111111',
    tooltip: {
      shouldOpen: () => true,
      title: (args) => {
        console.log('🚀 ~ args:', args)
        return '11'
      },
    },
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
    fixed: 'right',
    fieldType: ProFieldType.TREE_SELECT,
    valueEnum: StatusValueEnum,
    fieldProps: {
      showSearch: true,
      filterTreeNode: (inputValue, treeNode) => {
        console.log('🚀 ~ treeNode:', treeNode)
        console.log('🚀 ~ inputValue:', inputValue)
        return treeNode.text?.includes(inputValue)
      },
    },
    filters: [
      { value: '0', text: '禁用' },
      { value: '1', text: '启用' },
    ],
    options: [
      { value: '0', text: '禁用' },
      { value: '1', text: '启用' },
    ],
  },
]

const data: ProTableProps['dataSource'] = []
for (let i = 0; i < 2000; i++) {
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
    // children: [
    //   {
    //     id: '111111111' + i,
    //     children: [],
    //   },
    // ],
  })
}

const fetchData: ProTableRequest = async (params, sorters, filter) => {
  console.log('params:', params)
  console.log('filter:', filter)
  console.log('sorters:', sorters)
  await sleep(1000)
  return {
    success: true,
    data,
  }
}

const rowSelection: ProTableProps['rowSelection'] = {
  onChange: (selectedRowKeys: ProTableKey[], selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  getCheckboxProps: (record) => ({
    disabled: record.name === '王五', // Column configuration not to be checked
    name: record.name,
  }),
}

const formItems: ProFormItemType[] = [
  {
    fieldType: ProFieldType.GROUP,
    title: '账号信息',
    colProps: { span: 24 },
    children: [
      {
        name: 'userName',
        title: 'aaa',
        rules: [{ required: true, message: '请输入用户名', trigger: 'change' }],
        fieldProps: {
          maxlength: 40,
          autocomplete: 'off',
        },
      },
      {
        name: 'password',
        title: '密码',
        fieldType: ProFieldType.PASSWORD,
        rules: [{ required: true, message: '请输入密码', trigger: 'change' }],
        fieldProps: {
          autocomplete: 'new-password',
        },
      },
      {
        name: 'confirmPassword',
        title: '确认密码',
        fieldType: ProFieldType.PASSWORD,
        rules: (formData) => [
          { required: true, message: '请输入确认密码', trigger: 'change' },
          {
            validator: async (_rule: any, value: string) => {
              if (value === '') {
                return Promise.reject('请输入确认密码')
              } else if (value !== formData.password) {
                return Promise.reject('两次密码输入不一致!')
              } else {
                return Promise.resolve()
              }
            },
            trigger: 'change',
          },
        ],
      },
    ],
  },
  {
    fieldType: ProFieldType.GROUP,
    title: '个人信息',
    colProps: { span: 24 },
    children: [
      {
        name: 'fullName',
        title: '姓名',
        rules: [{ required: true, message: '请输入姓名', trigger: 'change' }],
      },
      {
        name: 'phone',
        title: '手机号',
      },
      {
        name: 'aaaaa',
        title: '邮箱',
      },
      {
        name: 'nickName',
        title: '昵称',
      },
      {
        name: 'sex',
        title: '性别',
        fieldType: ProFieldType.SELECT,
        initialValue: '0',
      },
      {
        name: 'birthday',
        title: '生日',
        fieldType: ProFieldType.DATE,
      },
      {
        name: 'idCard',
        title: '身份证号',
      },
      {
        name: 'school',
        title: '学校',
      },
      {
        name: 'education',
        title: '学历',
        fieldType: ProFieldType.SELECT,
      },
      {
        name: 'graduationTime',
        title: '毕业时间',
        fieldType: ProFieldType.DATE,
      },
      {
        name: 'address',
        title: '地址',
      },
      {
        name: 'orderNum',
        title: '排序',
        fieldType: ProFieldType.DIGIT,
        initialValue: 1,
        rules: [{ required: true, message: '请输入排序', trigger: 'change' }],
        fieldProps: {
          min: 1,
          formatter: (value) => (value ? parseInt(value) : value),
        },
      },
      {
        title: '简介',
        fieldType: ProFieldType.TEXTAREA,
        name: 'description',
        colProps: { span: 24 },
        fieldProps: {
          maxlength: 200,
          showCount: true,
        },
      },
    ],
  },
]

const columnsState: ProColumnStateType = {
  defaultValue: {
    graduateDate: {
      show: false,
    },
  },
}

const open = ref(false)

const handleTest = () => {
  open.value = true
  // tableRef.value?.reset()
}
</script>

<template>
  <ProPage title="123123" autoContentHeight>
    <ProTable
      ref="table"
      title="高级表格"
      :columns
      :columnsState
      :request="fetchData"
      perf
      :sticky="{
        offsetHeader: 50,
      }"
      virtual
      :height="500"
      row-hover
      highlight-select-row
      :row-selection="rowSelection"
      :options="{
        fullScreen: true,
      }"
      :search="{
        cardProps: {
          size: 'small',
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
    >
      <template #toolbarActions>
        <ProButton @click="handleTest">
          <template #icon><EllipsisOutlined /></template>
        </ProButton>
        <ProModalForm
          grid
          :width="1000"
          :colon="false"
          :label-col="{ style: { width: '90px' } }"
          :col-props="{ span: 12 }"
          title="新建"
          :items="formItems"
          :modal-props="{ destroyOnClose: true }"
        >
          <template #trigger>
            <ProButton type="primary">新建</ProButton>
          </template>
        </ProModalForm>
        <ProButton>
          <template #icon><EllipsisOutlined /></template>
        </ProButton>
      </template>
      <template #aaa>
        <span style="color: red">asdasd</span>
      </template>
    </ProTable>
  </ProPage>
  <!-- <ProModal title="高级表格" v-model:open="open">asdasd</ProModal> -->
  <ProDrawer title="高级表格" v-model:open="open" :width="1000" :body-style="{ padding: 0 }">
    <ProPage
      title="高级表格"
      style="padding: 0"
      autoContentHeight
      :contentStyle="{ backgroundColor: 'transparent', padding: '16px' }"
    >
      asdasd
    </ProPage>
  </ProDrawer>
</template>
