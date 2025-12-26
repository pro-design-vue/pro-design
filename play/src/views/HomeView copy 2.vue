<script setup lang="tsx">
import {
  ProTable,
  ProButton,
  ProFieldType,
  ProModal,
  ProDrawer,
  ProModalForm,
  ProDrawerForm,
  ProIcon,
  type ProTableValueEnumType,
  type ProTableProps,
  type ProTableColumnType,
  type ProTableRequest,
  type ProTableKey,
  type ProFormActionType,
  type ProTableInstance,
} from '@pro-design-vue/components'
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import { sleep } from '@pro-design-vue/utils'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { Checkbox, DatePicker, Input, message, Select, Upload } from 'ant-design-vue'
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
const openDrawer = ref(false)
const openDrawer2 = ref(false)
const tableRef = useTemplateRef<ProTableInstance>('table')

const asyncOptions = ref<any>([])

const columns: ProTableColumnType[] = [
  // {
  //   dataIndex: 'index',
  //   width: 100,
  //   hideInSetting: true,
  //   hideInSearch: true,
  //   fixed: true,
  //   renderText(text, record, rowIndex) {
  //     return rowIndex + 1
  //   },
  // },
  {
    title: '姓名',
    dataIndex: 'name',
    disable: true,
    width: 300,
    fixed: true,
    initialValue: '111',
    tooltip: true,
    search: {
      title: '12123',
      name: 'aaaa',
      order: 3,
    },
    headerTooltip: '1111',
    fieldProps: {
      prefix: 'aaa',
    },
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: Input,
      // defaultEditable: true,
      editableTrigger: 'dblClick',
      inlineError: true,
      // props, 透传全部属性到 Input 组件
      props: {
        allowClear: true,
        placeholder: '请输入',
      },
      rules: [
        {
          required: true,
          whitespace: true,
          message: '此项是必填项',
        },
        {
          message: '必须包含数字',
          pattern: /[0-9]/,
        },
        {
          max: 16,
          whitespace: true,
          message: '最长为 16 位',
        },
        {
          min: 6,
          whitespace: true,
          message: '最小为 6 位',
        },
      ],
    },
  },
  {
    title: '年龄',
    // hideInSearch: true,
    dataIndex: 'age',
    width: 200,
    sorter: true,
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: Input,
      // props, 透传全部属性到 Input 组件
      props: {
        allowClear: true,
        placeholder: '请输入',
      },
      // editable: ({ record }) => {
      //   // console.log('🚀 ~ record:', record)
      //   return record.sex === '1'
      // },
      keepEditMode: true,
      rules: [
        {
          required: true,
          message: '此项是必填项',
        },
      ],
    },
    search: {
      order: 1,
    },
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 200,
    hideInSearch: true,
    valueEnum: SexValueEnum,
    filters: [
      { value: '0', text: '未知' },
      { value: '1', text: '男' },
      { value: '2', text: '女' },
    ],
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: Select,
      keepEditMode: true,
      editableTrigger: 'contextmenu',
      // props, 透传全部属性到 Input 组件
      props: {
        allowClear: true,
        placeholder: '请选择',
        options: asyncOptions.value,
        onChange: (...args) => {
          console.log('🚀 ~ args:', args)
        },
      },
      on: () => ({
        onChange: (params) => {
          console.log(params)
          params?.updateEditedCellValue?.('age', 0)
        },
      }),
      dependencies: [['name']],
      request: (params) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                label: params.name,
                value: '1',
              },
              {
                label: '已解决222',
                value: '2',
              },
            ])
          }, 100)
        })
      },
      rules: [
        {
          required: true,
          message: '此项是必填项',
        },
      ],
    },
  },
  {
    title: '邮箱',
    // hideInSearch: true,
    width: 130,

    // ellipsis: true,
    // tooltip: true,
    dataIndex: 'detail.email',
  },
  {
    title: '毕业日期',
    width: 300,
    fieldType: ProFieldType.DATE_RANGE,
    dataIndex: 'graduateDate',
    search: {
      order: 2,
    },
    edit: {
      // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
      // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
      component: DatePicker,
      // component: Checkbox,
      // props, 透传全部属性到 Input 组件
      props: {
        allowClear: true,
        placeholder: '请选择',
        valueFormat: 'YYYY-MM-DD',
      },
      defaultEditable: true,
    },
  },
  {
    title: '状态',
    width: 300,
    dataIndex: 'status',
    fieldType: ProFieldType.CHECKBOX_GROUP,
    // valueEnum: StatusValueEnum,
    fieldProps: {
      fieldNames: {
        label: 'adValue',
        value: 'adKey',
      },
    },
    filters: [
      { value: '0', text: '禁用' },
      { value: '1', text: '启用' },
    ],
    request: async () => {
      return [
        { adKey: '0', adValue: '禁用' },
        { adKey: '1', adValue: '启用' },
      ]
    },
    // fixed: 'right',
    // options: [
    //   { value: '0', adValue: '禁用' },
    //   { value: '1', adValue: '启用' },
    // ],
  },
  {
    title: '操作',
    key: 'action',
    width: 115,
    hideInSearch: true,
    fixed: 'right',
    customRender: ({ record, startEditable, cancelEditable, isEditable, saveEditable }) => {
      const isEditing = isEditable(record.id)
      return (
        <div>
          {!isEditing && (
            <ProButton
              style="paddingInline: 0"
              type="link"
              onClick={() => startEditable(record.id)}
            >
              编辑
            </ProButton>
          )}
          {isEditing && (
            <>
              <ProButton
                style="paddingInline: 0"
                type="link"
                onClick={() => saveEditable(record.id)}
              >
                保存
              </ProButton>
              <ProButton
                style="paddingInlineEnd: 0"
                type="link"
                onClick={() => cancelEditable(record.id)}
              >
                取消
              </ProButton>
            </>
          )}
        </div>
      )
    },
  },
]

const data: ProTableProps['dataSource'] = []
for (let i = 0; i < 20; i++) {
  data.push({
    id: i + 1,
    name: ['王五', '张三', '李四'][i % 3],
    age: [20, 31, 18, 45][i % 3],
    status: (i % 3) + '',
    sex: ['1', '2', '0'][i % 3],
    detail: {
      email: ['w.cezkdudy@qq.com', 'r.nmgw@qq.com', 'p.cumx@qq.com'][i % 3],
    },
    graduateDate: ['2024-01-01', '2012-02-01', '2025-03-01', '2002-04-01'][i % 4],
    children: [
      {
        id: '111111111' + i,
        children: [],
      },
    ],
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

const getRowKey = (record) => {
  return record.id
}
const filterAction = ref<ProFormActionType>()
const handleInit = (values, action) => {
  filterAction.value = action
  console.log('🚀 ~ handleInit ~ action:', action)
  console.log('🚀 ~ handleInit ~ values:', values)
}

const handleTest = async () => {
  // tableRef.value?.addEditRecord(
  //   {
  //     id: Math.random().toString(),
  //   },
  //   {
  //     position: 'top',
  //   },
  // )
  const result = await tableRef.value?.validateTableData()
  console.log('🚀 ~ handleTest ~ result:', result)
}

onMounted(() => {
  setTimeout(() => {
    asyncOptions.value = [
      { value: '0', label: '未知啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊' },
      { value: '1', label: '男' },
      { value: '2', label: '女' },
    ]
  }, 3000)
})
</script>
<!-- :row-editable="{
  type: 'multiple',
  onlyAddOneLineAlertMessage: false,
}" -->
<template>
  <ProTable
    title="高级表格"
    :columns
    tooltip="asdasd"
    ref="table"
    :row-key="getRowKey"
    :request="fetchData"
    :sticky="{
      offsetHeader: 50,
    }"
    row-hover
    highlight-select-row
    :row-selection="rowSelection"
    :always-show-alert="false"
  >
    <template #toolbarActions="{ searchParams }">
      {{ searchParams }}
      <ProButton type="primary" @click="handleTest">测试</ProButton>
      <ProButton type="primary" @click="openDrawer = true">打开抽屉</ProButton>
    </template>
    <!-- <template #contextmenuPopup="args">
      <ul class="popup">
        <li class="popup-item">
          <copy-outlined />
          复制
        </li>
        <li class="popup-item">
          <copy-outlined />
          复制整行
        </li>
        <li class="popup-item">
          <copy-outlined />
          复制整列
        </li>
      </ul>
    </template> -->
  </ProTable>
  <ProDrawer
    title="抽屉"
    v-model:open="openDrawer"
    :width="1000"
    :body-style="{ paddingBottom: '0' }"
  >
    <ProTable
      title="高级表格"
      :columns
      :card-props="false"
      auto-height
      :row-key="getRowKey"
      :request="fetchData"
      virtual
    >
      <template #toolbarActions>
        <ProButton type="primary" @click="openDrawer2 = true">打开抽屉</ProButton>
      </template>
    </ProTable>
    <ProDrawer
      title="抽屉2"
      v-model:open="openDrawer2"
      :width="1000"
      :body-style="{ paddingBottom: '0' }"
    >
      <ProTable
        title="高级表格"
        :columns
        :card-props="false"
        auto-height
        :row-key="getRowKey"
        :pagination="false"
        :search="false"
        bordered
        :height="300"
      >
      </ProTable>
    </ProDrawer>
  </ProDrawer>
</template>
