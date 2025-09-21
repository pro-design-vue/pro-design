<script setup lang="ts">
import { ref } from 'vue'
import { sleep } from '@pro-design-vue/utils'
import { Space } from 'ant-design-vue'
import {
  ProFieldType,
  ProModalForm,
  ProButton,
  type ProFormItemType,
  type ProFormActionType,
} from 'pro-design-vue'

const modalFormRef = ref<ProFormActionType>()

const formItems: ProFormItemType[] = [
  {
    name: 'INPUT',
    title: '文本',
    width: 'sm',
  },
  {
    name: 'DIGIT',
    title: '数字',
    fieldType: ProFieldType.DIGIT,
  },
]

const handleFinish = async (val) => {
  await sleep(2000)
  console.log(val)
  return true
}

const handleInit = (values, action) => {
  modalFormRef.value = action
  action.setFieldValue('INPUT', '1111')
}

const handleReset = () => {
  modalFormRef.value?.reset()
}
</script>

<template>
  <Space>
    <ProModalForm
      ref="modal"
      :items="formItems"
      title="新建表单"
      :submitter="{
        searchConfig: {
          resetText: '重置',
        },
        resetButtonProps: {
          onClick: handleReset,
        },
      }"
      @finish="handleFinish"
      @init="handleInit"
    >
      <template #trigger>
        <ProButton type="primary">通过 form action 重置</ProButton>
      </template>
    </ProModalForm>
    <ProModalForm
      ref="modal"
      :items="formItems"
      title="新建表单"
      @finish="handleFinish"
      @init="handleInit"
    >
      <template #trigger>
        <ProButton type="primary">通过自定义 footer 按钮重置</ProButton>
      </template>
      <template #submitter="{ defaultDoms, action }">
        <component :is="defaultDoms" />
        <ProButton @click="action.reset">重置</ProButton>
      </template>
    </ProModalForm>
  </Space>
</template>
