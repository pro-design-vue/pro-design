<script setup lang="tsx">
import { sleep } from '@pro-design-vue/utils'
import { message, TreeSelect } from 'ant-design-vue'
import { ProFieldType, ProForm, type ProFormItemType } from 'pro-design-vue'

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
        key: '0-0-0',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-0',
        key: '0-1-0',
      },
      {
        title: 'Child Node4',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node5',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
]

const formItems: ProFormItemType[] = [
  {
    fieldType: ProFieldType.GROUP,
    children: [
      {
        name: 'name',
        title: '签约客户名称',
        initialValue: '2',
        width: 'md',
        tooltip: '最长为 24 位',
        placeholder: '请输入名称',
        formItemProps: {
          required: true,
        },
        fieldProps: {
          maxlength: 24,
        },
        extra: {
          item: <a style="margin-left: 5px">客户名称应该怎么获得？</a>,
        },
      },
      {
        name: 'company',
        title: '我方公司名称',
        width: 'md',
        placeholder: '请输入名称',
      },
    ],
  },
  {
    name: 'count',
    title: '人数',
    width: 'lg',
    fieldType: ProFieldType.DIGIT,
  },
  {
    fieldType: ProFieldType.GROUP,
    children: [
      {
        title: '合同名称',
        name: 'contract',
        width: 'md',
      },
      {
        name: 'createTime',
        title: '合同生效时间',
        width: 'md',
        fieldType: ProFieldType.DATE,
      },
    ],
  },
  {
    fieldType: ProFieldType.GROUP,
    children: [
      {
        title: '合同约定生效方式',
        name: 'useMode',
        width: 'xs',
        readonly: true,
        fieldType: ProFieldType.SELECT,
        options: [
          {
            value: 'chapter',
            label: '盖章后生效',
          },
        ],
      },
      {
        name: 'unusedMode',
        title: '合同约定失效方式',
        fieldType: ProFieldType.SELECT,
        fieldProps: {
          showSearch: true,
        },
        options: [
          {
            value: 'time',
            label: '履行完终止',
            type: 'time',
            options: [
              {
                value: 'time1',
                label: '履行完终止1',
              },
              {
                value: 'time2',
                label: '履行完终止2',
              },
            ],
          },
        ],
      },
      {
        name: 'money',
        title: '合同约定金额',
        width: 'md',
        fieldType: ProFieldType.DIGIT,
        fieldProps: {
          min: 0,
        },
      },
    ],
  },
  {
    name: 'id',
    title: '主合同编号',
    width: 'sm',
  },
  {
    name: 'project',
    title: '项目名称',
    width: 'md',
    disabled: true,
    initialValue: 'xxxx项目',
  },
  {
    name: 'address',
    title: '详细的工作地址或家庭住址',
    fieldType: ProFieldType.TEXTAREA,
  },
  {
    name: 'areaList',
    title: '区域',
    width: 'md',
    initialValue: ['zhejiang', 'hangzhou', 'xihu'],
    fieldType: ProFieldType.CASCADER,
    request: async () => {
      await sleep(1000)
      return [
        {
          value: 'zhejiang',
          label: '浙江',
          children: [
            {
              value: 'hangzhou',
              label: '杭州',
              children: [
                {
                  value: 'xihu',
                  label: '西湖',
                },
              ],
            },
          ],
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                },
              ],
            },
          ],
        },
      ]
    },
  },
  {
    name: 'treeSelect',
    title: '树形下拉选择器',
    width: 600,
    initialValue: ['0-0-0'],
    fieldType: ProFieldType.TREE_SELECT,
    options: treeData,
    fieldProps: {
      fieldNames: {
        label: 'title',
      },
      treeCheckable: true,
      showCheckedStrategy: TreeSelect.SHOW_PARENT,
    },
  },
  {
    name: 'dateRange',
    title: '日期区间',
    width: 400,
    fieldType: ProFieldType.DATE_RANGE,
    transform: (value) => {
      return {
        startDate: value?.[0],
        endDate: value?.[1],
      }
    },
  },
  {
    name: 'formList',
    fieldType: ProFieldType.FORM_LIST,
    children: [
      {
        fieldType: ProFieldType.GROUP,
        children: [
          { name: 'name1', title: '姓名', width: 'md' },
          { name: 'age', title: '年龄', width: 'xs', fieldType: ProFieldType.DIGIT },
        ],
      },
    ],
  },
]

const fetchDetail = async (params) => {
  console.log('🚀 ~ request: ~ params:', params)
  await sleep(1500)
  return {
    name: 'Pro Design 有限公司',
    useMode: 'chapter',
  }
}

const handleFinish = async (val) => {
  await sleep(2000)
  console.log(val)
  message.success('提交成功')
}
</script>

<template>
  <ProForm
    :items="formItems"
    layout="vertical"
    :request="fetchDetail"
    :params="{ id: '100' }"
    @finish="handleFinish"
  >
  </ProForm>
</template>
