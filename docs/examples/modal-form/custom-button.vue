<script setup lang="ts">
import { sleep } from '@pro-design-vue/utils'
import { Space } from 'ant-design-vue'
import { ProFieldType, ProModalForm, ProButton, type ProFormItemType } from 'pro-design-vue'

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
  console.log('🚀 ~ handleInit ~ values:', values)
  action.setFieldValue('INPUT', '1111')
}
</script>

<template>
  <Space>
    <ProModalForm :items="formItems" title="新建表单" @finish="handleFinish" @init="handleInit">
      <template #trigger>
        <ProButton type="primary">自定义footer按钮</ProButton>
      </template>
      <template #submitter="{ defaultDoms, action }">
        <ProButton @click="action.reset">重置</ProButton>
        <component :is="defaultDoms" />
      </template>
    </ProModalForm>
    <ProModalForm
      :items="formItems"
      title="新建表单"
      :submitter="{
        searchConfig: {
          submitText: '新建',
          resetText: '取消',
        },
      }"
      @finish="handleFinish"
      @init="handleInit"
    >
      <template #trigger>
        <ProButton type="primary">自定义文字</ProButton>
      </template>
    </ProModalForm>
    <ProModalForm
      :items="formItems"
      title="新建表单"
      :submitter="{
        resetButtonProps: {
          type: 'dashed',
        },
        submitButtonProps: false,
      }"
    >
      <template #trigger>
        <ProButton type="primary">隐藏或修改按钮样式</ProButton>
      </template>
    </ProModalForm>
    <ProModalForm :items="formItems" title="新建表单" :submitter="false">
      <template #trigger>
        <ProButton type="primary">隐藏footer</ProButton>
      </template>
    </ProModalForm>
  </Space>
</template>
