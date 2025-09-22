<script setup lang="ts">
import { sleep } from '@pro-design-vue/utils'
import { message } from 'ant-design-vue'
import { ProFieldType, ProStepsForm, type ProFormItemType } from 'pro-design-vue'
import { useTemplateRef } from 'vue'

const formRef = useTemplateRef<any>('form')
const steps = [
  {
    title: '创建实验',
    description: '这里填入的都是基本信息',
    formProps: {
      request: async () => {
        return {
          name: '111',
        }
      },
      onFinish: async (values) => {
        console.log(values)
        formRef.value.formArrayRef[1].value?.setFieldsValue({
          name: '11111',
        })
        await sleep(2000)
        return true
      },
    },
  },
  {
    title: '设置参数',
    description: '这里填入运维参数',
    subTitle: 'Left 00:00:08',
    formProps: {
      request: async () => {
        return {
          name: '111',
        }
      },
      onFinish: async (values) => {
        console.log(values)
        await sleep(2000)
        return true
      },
    },
  },
  {
    title: '发布实验',
    description: '这里填入发布判断',
    formProps: {
      onFinish: async (values) => {
        console.log(values)
        await sleep(2000)
        return true
      },
    },
  },
]

const formItems: ProFormItemType[][] = [
  [
    {
      name: 'name',
      title: '实验名称',
      width: 'md',
      allowClear: true,
      tooltip: '最长为 24 位，用于标定的唯一 id',
      placeholder: '请输入名称',
      fieldProps: {
        maxlength: 24,
      },
      rules: [{ required: true }],
    },
    {
      name: 'date',
      title: '日期',
      fieldType: ProFieldType.DATE,
    },
    {
      name: 'dateTime',
      title: '时间区间',
      fieldType: ProFieldType.TIME_RANGE,
    },
    {
      name: 'remark',
      title: '备注',
      width: 'lg',
      fieldType: ProFieldType.TEXTAREA,
    },
  ],
  [
    {
      name: 'checkbox',
      title: '迁移类型',
      fieldType: ProFieldType.CHECKBOX_GROUP,
      options: ['结构迁移', '全量迁移', '增量迁移', '全量校验'],
    },
    {
      fieldType: ProFieldType.GROUP,
      children: [
        {
          name: 'name',
          title: '名称',
          allowClear: true,
        },
        {
          name: 'date1',
          title: '日期',
          width: 'sm',
          fieldType: ProFieldType.DATE,
        },
      ],
    },
    {
      name: 'remark1',
      title: '备注',
      width: 'lg',
      fieldType: ProFieldType.TEXTAREA,
    },
  ],
  [
    {
      name: 'checkbox',
      title: '性别',
      fieldType: ProFieldType.RADIO_GROUP,
      options: ['男', '女', '未知'],
      rules: [{ required: true }],
    },
    {
      name: 'select',
      title: '学历',
      width: 'lg',
      fieldType: ProFieldType.SELECT,
      options: [
        {
          value: '1',
          text: '小学',
        },
        {
          value: '2',
          text: '初中',
        },
      ],
    },
  ],
]

const handleFinish = async (values) => {
  console.log('🚀 ~ handleFinish ~ values:', values)
  await sleep(2000)
  message.success('提交成功')
  return true
}
</script>

<template>
  <ProStepsForm
    ref="form"
    :steps
    layout="vertical"
    :validate-messages="{
      required: '此项为必填项',
    }"
    :items="formItems"
  >
  </ProStepsForm>
</template>
