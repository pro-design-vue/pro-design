<script setup lang="ts">
import { ref } from 'vue'
import { sleep } from '@pro-design-vue/utils'
import { message, Space } from 'ant-design-vue'
import {
  ProButton,
  ProFieldType,
  ProStepsForm,
  type ProFormItemType,
  ProModal,
} from 'pro-design-vue'

const footerRef = ref<HTMLDivElement>()
const open = ref(false)
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

const handleOpen = () => {
  open.value = true
}

const handleFinish = async (values) => {
  console.log('🚀 ~ handleFinish ~ values:', values)
  await sleep(2000)
  message.success('提交成功')
  open.value = false
  return true
}
</script>

<template>
  <ProButton type="primary" @click="handleOpen">新建表单</ProButton>
  <ProModal title="新建表单" :width="1000" v-model:open="open">
    <ProStepsForm
      ref="form"
      :steps
      grid
      layout="vertical"
      :validate-messages="{
        required: '此项为必填项',
      }"
      :items="formItems"
      :submitter="{
        teleport: footerRef,
      }"
      @finish="handleFinish"
    />
    <template #footer>
      <Space>
        <ProButton @click="open = false">取消</ProButton>
        <div ref="footerRef"></div>
      </Space>
    </template>
  </ProModal>
</template>
