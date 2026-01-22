<!--
 * @Author: shen
 * @Date: 2025-10-22 16:31:15
 * @LastEditors: shen
 * @LastEditTime: 2026-01-21 11:01:47
 * @Description:
-->
<script setup lang="tsx">
import {
  ProField,
  ProButton,
  ProFormItem,
  ProFormField,
  ProForm,
  ProFormFieldSet,
  ProFormList,
} from '@pro-design-vue/components'
import { Space, Radio, Descriptions, Form, Input } from 'ant-design-vue'
import { Fragment, ref } from 'vue'
import dayjs from 'dayjs'
import { sleep } from '@pro-design-vue/utils'
const state = ref<any>('read')
const radio = ref('open')
const numberRange = ref([123, 456])
const dateValue = ref(dayjs('2019-11-16 12:50:26').valueOf())
const dateRangeValue = ref([
  dayjs('2019-11-16 12:50:26').add(-1, 'd').valueOf(),
  dayjs('2019-11-16 12:50:26').valueOf(),
])

const treeData = [
  {
    label: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-0',
      },
    ],
  },
  {
    label: 'Node2',
    value: '0-1',
    children: [
      {
        label: 'Child Node3',
        value: '0-1-0',
      },
      {
        label: 'Child Node4',
        value: '0-1-1',
      },
      {
        label: 'Child Node5',
        value: '0-1-2',
      },
    ],
  },
]

const requestTreeData = async () => {
  await sleep(2000)
  return treeData
}

const switchValue = ref(true)
const treeValue = ref('0-1')
const optionRender = () => {
  return (
    <Fragment>
      <ProButton>aaa</ProButton>
      <ProButton>bbb</ProButton>
    </Fragment>
  )
}
const codeValue = ref(`
yarn run v1.22.0
$ eslint --format=pretty ./packages
Done in 9.70s.
          `)

const handleRateChange = (value) => {
  console.log('🚀 ~ handleRateChange ~ value:', value)
}

const fetchaData = async () => {
  return {}
}

const formRef = ref<any>()
const onValuesChange = (changedValues, formValues) => {
  // console.log('🚀 ~ onValuesChange ~ changedValues:', changedValues)
  console.log('🚀 ~ onValuesChange ~ formValues:', formValues)
}

const onFinish = async (values) => {
  console.log(formRef.value)
  await sleep(2000)
  console.log('🚀 ~ onFinish ~ values:', values)
}

const onChange = (...args) => {
  console.log('🚀 ~ onChange ~ args:', args)
}
</script>

<template>
  <div style="width: 1000px; padding: 50px 30px; margin: 100px; border: 1px solid #f1f1f1">
    <ProForm
      grid
      :request="fetchaData"
      autoFocusFirstInput
      :formRef="(ref) => (formRef = ref)"
      :col-props="{ span: 12 }"
      :row-props="{ gutter: 16 }"
      @values-change="onValuesChange"
      @finish="onFinish"
    >
      <!-- <ProFormFieldSet
        name="list"
        readonly
        label="组件列表"
        :col-props="{ span: 12 }"
        :initialValue="['0', 'red']"
        :transform="(value: any) => ({
          list: value,
          startTime: value[0],
          endTime: value[1],
        })"
        :rules="[{ required: true }]"
      >
        <ProFormField
          value-type="select"
          :col-props="{ span: 20 }"
          :value-enum="{
            0: {
              text: '男',
            },
          }"
        >
        </ProFormField>
        <ProFormField value-type="color" :col-props="{ span: 4 }" />
      </ProFormFieldSet> -->
      <ProForm.Group
        title="分组标题"
        tooltip="啊啊啊啊"
        extra="extra"
        collapsible
        :col-props="{ span: 24 }"
      >
        <ProFormField
          label="姓名"
          tooltip="我是Pro Component"
          name="name"
          width="sm"
          :rules="[{ required: true }]"
          @change="onChange"
        />
        <ProFormField
          label="性别"
          initialValue="0"
          value-type="select"
          name="sex1"
          @change="onChange"
          :value-enum="{
            0: {
              text: '男',
            },
          }"
        />
      </ProForm.Group>
      <ProFormField
        label="内部"
        tooltip="我是Pro Component"
        name="age"
        width="lg"
        initial-value="123"
        placeholder="请输入内部名称"
        @change="onChange"
        :rules="[{ required: true }]"
      />
      <ProFormList :name="['default', 'users']" label="用户信息" :tooltip="{ title: '111' }">
        <ProFormField key="useMode" name="name" label="姓名" />
      </ProFormList>
    </ProForm>
  </div>
</template>
