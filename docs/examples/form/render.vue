<script setup lang="tsx">
import { sleep } from '@pro-design-vue/utils'
import { message } from 'ant-design-vue'
import { ProFieldType, ProForm, type ProFormItemType } from 'pro-design-vue'
import { h } from 'vue'
import CustomItem from './custom-item.vue'

const formItems: ProFormItemType[] = [
  {
    name: 'name',
    title: '::custom-title1',
    tooltip: '最长为 24 位',
    placeholder: '请输入姓名',
    formItemProps: {
      titleStyles: {
        width: 'auto',
      },
      extra: '::form-item-extra',
    },
    fieldProps: {
      suffix: '::custom-suffix',
    },
    extra: {
      label: ({ formData }) => h('span', `我是title的extra${formData.age || ''}`),
      item: ({ formData }) => <a>我是item的extra{formData.age}</a>,
    },
  },
  {
    name: 'age',
    title: '::custom-title2',
    width: 'md',
    fieldType: ProFieldType.DIGIT,
    fieldProps: {
      addonAfter: '岁',
      min: 0,
      max: 100,
    },
  },
  {
    name: 'sex',
    width: 'md',
    fieldType: ProFieldType.SELECT,
    options: [
      { value: 'China', label: '中国', icon: '🇨🇳' },
      { value: 'USA', label: '美国', icon: '🇺🇸' },
      { value: 'Japan', label: '日本', icon: '🇯🇵' },
      { value: 'Korea', label: '韩国', icon: '🇰🇷' },
    ],
    fieldProps: {
      option: '::custom-option',
    },
  },
  {
    fieldType: ProFieldType.GROUP,
    renderFormItem: '::custom-group',
    children: [
      {
        name: 'name',
        title: '签约客户名称',
        initialValue: '2',
        width: 'md',
        tooltip: '最长为 24 位',
        placeholder: '请输入名称',
        fieldProps: {
          maxlength: 24,
        },
        extra: {
          item: <a style="margin-left: 5px">客户名称应该怎么获得？</a>,
        },
        rules: [{ required: true, message: '请输入名称', trigger: 'change' }],
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
    name: 'custom-slot',
    title: '自定义表单项-slot',
    width: 'md',
    renderFormItem: '::custom-item-slot',
    rules: [{ required: true, message: '请选择', trigger: 'change' }],
  },
  {
    name: 'custom-tsx',
    title: '自定义表单项-tsx',
    width: 'md',
    renderFormItem: ({ value, onChange }) => {
      return <CustomItem value={value} onChange={onChange} />
    },
    rules: [{ required: true, message: '请选择', trigger: 'change' }],
  },
]

const handleFinish = async (val) => {
  await sleep(2000)
  console.log(val)
  message.success('提交成功')
}
</script>

<template>
  <ProForm :items="formItems" layout="vertical" @finish="handleFinish">
    <template #form-item-extra> form-item-extra </template>
    <template #custom-suffix> custom-suffix </template>
    <template #custom-title1> <span style="color: red">自定义标题</span> </template>
    <template #custom-title2="{ formData }">
      {{ formData.name }}：{{ formData.age || 0 }}岁
    </template>
    <template #custom-option="{ value, label, icon }">
      <span>{{ icon }} &nbsp;&nbsp;{{ label }}（{{ value }}）</span>
    </template>
    <template #custom-group="{ defaultDom }">
      <div
        style="
          padding: 10px 10px 0;
          margin-bottom: 10px;
          background-color: #f1f1f1;
          border-radius: 6px;
        "
      >
        <component :is="defaultDom"></component>
      </div>
    </template>
    <template #custom-item-slot="{ value, onChange }">
      <CustomItem :value="value" @change="onChange" />
    </template>
  </ProForm>
</template>
