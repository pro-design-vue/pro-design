<script setup lang="tsx">
import { sleep } from '@pro-design-vue/utils'
import { message } from 'ant-design-vue'
import { ProFieldType, ProForm, type ProFormItemType } from 'pro-design-vue'

const formItems: ProFormItemType[] = [
  {
    name: 'name',
    title: '姓名',
    width: 'md',
    tooltip: '最长为 24 位',
    placeholder: '请输入姓名',
    linkage: {
      disabled: (value) => {
        return !value ? ['age'] : []
      },
      clear: (value) => {
        return !value ? ['age'] : []
      },
      hidden: (value) => {
        return !value ? ['sex'] : []
      },
    },
  },
  {
    name: 'age',
    title: ({ formData }) => {
      return formData.name && formData.age ? `年龄(${formData.name}${formData.age}岁)` : '年龄'
    },
    width: 'md',
    fieldType: ProFieldType.DIGIT,
  },
  {
    name: 'sex',
    title: '性别',
    width: 'md',
    fieldType: ProFieldType.SELECT,
    options: ['男', '女'],
  },
  {
    name: 'province',
    title: '省份',
    width: 'md',
    fieldType: ProFieldType.SELECT,
    linkage: {
      clear: ['city'],
    },
    request: async () => {
      await sleep(500)
      return [
        { value: '1', label: '黑龙江省' },
        { value: '2', label: '吉林省' },
      ]
    },
  },
  {
    name: 'city',
    title: '城市',
    width: 'md',
    dependencies: ['province'],
    fieldType: ProFieldType.SELECT,
    request: async (params) => {
      await sleep(500)
      return [
        { value: '1', label: '哈尔滨市', province: '1' },
        { value: '2', label: '齐齐哈尔市', province: '1' },
        { value: '3', label: '长春市', province: '2' },
        { value: '4', label: '吉林市', province: '2' },
      ].filter((item) => item.province === params.province)
    },
  },
]

const handleFinish = async (val) => {
  await sleep(2000)
  console.log(val)
  message.success('提交成功')
}
</script>

<template>
  <ProForm :items="formItems" layout="vertical" @finish="handleFinish"> </ProForm>
</template>
