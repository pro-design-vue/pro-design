<script setup lang="ts">
import { ProFieldType, ProForm, type ProFormItemType } from 'pro-design-vue'

const formItems: ProFormItemType[] = [
  {
    name: 'INPUT',
    title: '文本',
    initialValue: '22222',
    readonly: true,
    readonlyProps: {
      copy: true,
    },
    // width: 'md',
  },
  {
    name: 'DIGIT',
    title: '数字',
    fieldType: ProFieldType.DIGIT,
    rules: [{ required: true, message: '请输入文本', trigger: 'change' }],
  },
  {
    name: 'DIGIT_RANGE',
    title: '数字区间',
    fieldType: ProFieldType.DIGIT_RANGE,
  },
  {
    name: 'SELECT',
    title: '选择器',
    fieldType: ProFieldType.SELECT,
    options: [
      { value: '1', label: '男' },
      { value: '2', label: '女' },
    ],
  },

  {
    name: 'TREE_SELECT',
    title: '树形选择器',
    fieldType: ProFieldType.TREE_SELECT,
    options: [
      {
        value: '1',
        label: '吉林省',
        children: [
          { value: '1-1', label: '长春市' },
          { value: '1-2', label: '吉林市' },
          { value: '1-3', label: '四平市' },
        ],
      },
      {
        value: '2',
        label: '黑龙江省',
        children: [
          { value: '2-1', label: '哈尔滨市' },
          { value: '2-2', label: '齐齐哈尔市' },
          { value: '2-3', label: '牡丹江市' },
        ],
      },
    ],
  },
  {
    name: 'CASCADER',
    title: '级联选择器',
    fieldType: ProFieldType.CASCADER,
    options: [
      {
        value: '1',
        label: '吉林省',
        children: [
          { value: '1-1', label: '长春市' },
          { value: '1-2', label: '吉林市' },
          { value: '1-3', label: '四平市' },
        ],
      },
      {
        value: '2',
        label: '黑龙江省',
        children: [
          { value: '2-1', label: '哈尔滨市' },
          { value: '2-2', label: '齐齐哈尔市' },
          { value: '2-3', label: '牡丹江市' },
        ],
      },
    ],
  },
  {
    name: 'SELECT',
    title: '选择器（远程-所有options都支持）',
    initialValue: '1',
    fieldType: ProFieldType.SELECT,
    request: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { value: '1', label: '男' },
            { value: '2', label: '女' },
          ])
        }, 3000)
      }),
  },
  {
    name: 'date',
    title: '日期',
    fieldType: ProFieldType.DATE,
  },
  {
    name: 'dateRange',
    title: '日期区间',
    fieldType: ProFieldType.DATE_RANGE,
  },
  {
    fieldType: ProFieldType.GROUP,
    title: '分组',
    colProps: {
      span: 24,
    },
    children: [
      {
        name: 'time',
        title: '时间',
        formItemProps: {},
        fieldProps: {},
        colProps: {
          span: 12,
        },
        fieldType: ProFieldType.TIME,
      },
      {
        name: 'timeRange',
        title: '时间区间',
        fieldType: ProFieldType.TIME_RANGE,
      },
      // {
      //   name: 'UPLOAD_BUTTON',
      //   title: '点击上传',
      //   fieldType: ProFieldType.UPLOAD_BUTTON,
      // },
    ],
  },
  {
    name: 'UPLOAD_PICTURE',
    title: '上传图片',
    allowClear: true,
    fieldType: ProFieldType.UPLOAD_PICTURE,
    rules: [{ required: true, message: '请选择图片', trigger: 'change' }],
    fieldProps: {
      width: 118,
      height: 118,
      // isCropper: false,
      showTitle: true,
      // customRequest: async (params) => {
      //   try {
      //     const { data, code } = await uploadImageFile(params, { folder: 'tenants' })
      //     if (code === 200) {
      //       return data
      //     }
      //     return null
      //   } catch (error) {
      //     return null
      //   }
      // },
    },
  },
  {
    name: 'UPLOAD_DRAGGER',
    title: '拖拽上传',
    fieldType: ProFieldType.UPLOAD_DRAGGER,
    // colProps: {
    //   span: 24,
    // },
  },
  {
    title: '文本域',
    name: 'textarea',
    fieldType: ProFieldType.TEXTAREA,
    colProps: {
      span: 24,
    },
  },
]

const handleFinish = async (val) => {
  console.log('🚀 ~ handleReset ~ val:', val)
  return true
}
</script>

<template>
  <ProForm grid :col-props="{ span: 12 }" :items="formItems" @finish="handleFinish"> </ProForm>
</template>
