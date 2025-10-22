<script setup lang="ts">
import {
  ProTable,
  ProButton,
  ProFieldType,
  ProModal,
  ProDrawer,
  ProModalForm,
  type ProTableValueEnumType,
  type ProTableProps,
  type ProTableColumnType,
  type ProTableRequest,
  type ProTableKey,
  type ProTableDensitySize,
  type ProFormItemType,
} from '@pro-design-vue/components'
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import { sleep } from '@pro-design-vue/utils'
import { ref } from 'vue'
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
    fieldProps: {
      prefix: 'aaa',
    },
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

const formItems: ProFormItemType[] = [
  {
    title: '基本信息',
    fieldType: ProFieldType.GROUP,
    colProps: { span: 24 },
    children: [
      {
        name: 'sid',
        title: '设备号',
        placeholder: '请输入15位数字设备号',
        rules: [{ required: true, message: '请输入15位数字设备号', trigger: 'change' }],
        fieldProps: {
          maxlength: 15,
          showCount: true,
          addonAfter: 'sidAddonAfter',
        },
      },
      {
        name: 'iccid',
        title: 'SIM卡号',
        placeholder: '请输入13位数字SIM卡号',
        rules: [{ required: true, message: '请输入13位数字SIM卡号', trigger: 'change' }],
        fieldProps: {
          maxlength: 13,
        },
      },
      {
        name: 'vin',
        title: '车辆VIN',
        placeholder: '请输入17位字母和数字VIN',
        fieldProps: {
          maxlength: 17,
        },
      },
      {
        name: 'ein',
        title: '车辆EIN',
        placeholder: '请输入17位字母和数字EIN',
        fieldProps: {
          maxlength: 17,
        },
      },
      {
        name: 'engineModel',
        title: '发动机型号',
        placeholder: '请选择发动机型号',
        fieldType: ProFieldType.SELECT,
        rules: [{ required: true, message: '请选择发动机型号', trigger: 'change' }],
      },
      {
        name: 'carType',
        title: '匹配车型',
        placeholder: '请输入匹配车型',
        fieldProps: {
          maxlength: 10,
        },
      },
      {
        name: 'carUse',
        title: '车辆用途',
        placeholder: '请输入车辆用途',
        fieldProps: {
          maxlength: 10,
        },
      },
      {
        name: 'dataNum',
        title: '数据号',
        placeholder: '请输入数据号',
        fieldProps: {
          maxlength: 20,
        },
      },
      {
        name: 'contactPerson',
        title: '联系人',
        placeholder: '请输入联系人',
        fieldProps: {
          maxlength: 10,
        },
      },
      {
        name: 'tel',
        title: '电话',
        placeholder: '请输入联系电话',
        fieldProps: {
          maxlength: 11,
        },
      },
      {
        name: 'ownedUser',
        title: '所属客户',
        placeholder: '请输入所属客户',
      },
      {
        name: 'terrainType',
        title: '地势类别',
        placeholder: '请选择地势类别',
        fieldType: ProFieldType.SELECT,
        options: ['中原', '平原', '高原'],
      },
      {
        name: 'dataConfigUuid',
        title: '采集配置名称',
        placeholder: '请选择采集配置文件',
        fieldType: ProFieldType.SELECT,
      },
      {
        name: 'status',
        title: '设备状态',
        initialValue: '0',
        fieldType: ProFieldType.RADIO_GROUP,
      },
    ],
  },
  {
    title: '关联电控',
    name: 'ecuModelList',
    colProps: { span: 24 },
    fieldType: ProFieldType.FORM_LIST,
    formItemProps: {
      // labelCol: { span: 24 },
    },
    fieldProps: {
      rowTitle: '电控',
      rowTitleStyle: {
        width: '80px',
        textAlign: 'right',
      },
      alwaysShowItemLabel: true,
      copyIconProps: false,
      creatorButtonProps: {
        type: 'default',
        block: false,
        creatorButtonText: '添加电控',
      },
    },
    children: [
      {
        name: 'ecuModel',
        title: '电控型号',
        placeholder: '例如：6DC4',
        rules: [{ required: true, message: '电控型号不能为空', trigger: 'change' }],
      },
      {
        name: 'ecuType',
        title: '电控厂家',
        placeholder: '请输入电控厂家',
      },
      {
        name: 'ecuFactory',
        title: '电控类型',
        placeholder: '例如：发动机电控',
      },
      {
        name: 'ecuRemark',
        title: '备注',
        placeholder: '请输入备注',
      },
    ],
  },
]

const open = ref(false)
</script>

<template>
  <ProTable
    title="高级表格"
    :columns
    :request="fetchData"
    :sticky="{
      offsetHeader: 50,
    }"
    row-hover
    highlight-select-row
    :row-selection="rowSelection"
    :options="{
      fullScreen: true,
    }"
    :pagination="{
      fieldNames: {
        pageSize: 'size1',
      },
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
  <ProModal title="高级表格" v-model:open="open">asdasd</ProModal>
  <!-- <ProDrawer v-model:open="open">asdasd</ProDrawer> -->
</template>
