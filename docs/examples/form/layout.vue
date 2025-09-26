<script setup lang="tsx">
import { sleep } from '@pro-design-vue/utils'
import { message, Space } from 'ant-design-vue'
import { ProFieldType, ProForm, type ProFormItemType } from 'pro-design-vue'
import { computed, ref } from 'vue'

const LAYOUT_TYPE_HORIZONTAL = 'horizontal'

const formLayout = ref<string>(LAYOUT_TYPE_HORIZONTAL)

const formItemLayout = computed(() =>
  formLayout.value === LAYOUT_TYPE_HORIZONTAL
    ? {
        labelCol: { style: { width: '140px' } },
      }
    : null,
)

const formItems: ProFormItemType[] = [
  {
    name: 'layout',
    title: '标签布局',
    fieldType: ProFieldType.RADIO_GROUP,
    options: ['horizontal', 'vertical'],
    initialValue: formLayout.value,
    fieldProps: {
      optionType: 'button',
    },
    onChange: (val) => {
      formLayout.value = val
    },
  },
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
  },
  {
    name: 'company',
    title: '我方公司名称',
    width: 'md',
    placeholder: '请输入名称',
  },
  {
    title: '合同名称',
    name: 'contract',
    width: 'md',
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
    v-bind="formItemLayout"
    :items="formItems"
    :layout="formLayout"
    :request="fetchDetail"
    :params="{ id: '100' }"
    @finish="handleFinish"
  >
    <template #submitter="{ defaultDoms }" v-if="formLayout === LAYOUT_TYPE_HORIZONTAL">
      <Space style="margin-left: 140px">
        <component :is="defaultDoms"></component>
      </Space>
    </template>
  </ProForm>
</template>
