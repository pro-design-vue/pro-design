<!--
 * @Author: shen
 * @Date: 2025-10-22 16:31:15
 * @LastEditors: shen
 * @LastEditTime: 2026-02-26 09:15:00
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
  ProFormGroup,
} from '@pro-design-vue/components'
import { Card } from 'ant-design-vue'
import { Fragment, ref } from 'vue'
import dayjs from 'dayjs'
import { sleep } from '@pro-design-vue/utils'
import { CloseCircleOutlined, SmileOutlined } from '@ant-design/icons-vue'
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
  // console.log('🚀 ~ onValuesChange ~ formValues:', formValues)
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
      :request="fetchaData"
      autoFocusFirstInput
      :formRef="(ref) => (formRef = ref)"
      :row-props="{ gutter: 16 }"
      :col-props="{ span: 12 }"
      @values-change="onValuesChange"
      @finish="onFinish"
    >
      <ProFormList
        :name="['users']"
        label="用户信息"
        :tooltip="{ title: '111' }"
        :creatorButtonProps="{
          position: 'top',
        }"
        :initial-value="[{ value: '333', label: '333' }]"
        :col-props="{ span: 24 }"
        :copyIconProps="{ Icon: SmileOutlined, tooltipText: '复制此项到末尾' }"
        :deleteIconProps="{
          Icon: CloseCircleOutlined,
          tooltipText: '不需要这行了',
        }"
      >
        <!-- <template #itemRender="{ listDom, actionDom, index }">
          <Card :title="`用户${index + 1}`" bordered style="margin-bottom: 10px" :extra="actionDom">
            <component :is="listDom" />
          </Card>
        </template> -->
        <ProFormGroup :col-props="{ span: 24 }">
          <ProFormField
            name="value"
            label="值"
            :rules="[{ required: true, message: '请输入值' }]"
          />
          <ProFormField name="label" label="显示名称" />
          <ProFormField
            value-type="select"
            name="status"
            label="状态"
            :value-enum="{
              success: {
                text: '成功',
              },
              error: {
                text: '失败',
              },
            }"
          />
        </ProFormGroup>

        <!-- <template #fieldExtraRender>asdasd</template> -->
      </ProFormList>
    </ProForm>
  </div>
</template>
