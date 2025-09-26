<script setup lang="tsx">
import { sleep } from '@pro-design-vue/utils'
import { message } from 'ant-design-vue'
import { ProFormInstance } from 'pro-design-vue'
import { ProFieldType, ProForm, ProButton, type ProFormItemType } from 'pro-design-vue'
import { ref, useTemplateRef } from 'vue'

const loading = ref(false)
const formRef = useTemplateRef<ProFormInstance>('form')

const formItems: ProFormItemType[] = [
  {
    name: 'name',
    title: '姓名',
    width: 'md',
    tooltip: '最长为 24 位',
    placeholder: '请输入姓名',
  },
  {
    name: 'age',
    title: '年龄',
    width: 'md',
    fieldType: ProFieldType.DIGIT,
  },
  {
    name: 'sex',
    width: 'md',
    fieldType: ProFieldType.SELECT,
    options: ['男', '女'],
  },
]

const handleSet = () => {
  formRef.value?.setFieldsValue({
    name: 'Pro Design',
    age: 1,
  })
}

const handleGet = () => {
  message.info(`姓名为 "${formRef?.value?.getFieldValue('name')}"`)
}

const handleSubmit = async (values, action) => {
  console.log(action)
  loading.value = true
  await sleep(2000)
  console.log(values)
  message.success('提交成功')
  loading.value = false
  return false
}
</script>

<template>
  <div id="teleport" style="margin-bottom: 20px"></div>
  <ProForm
    ref="form"
    :items="formItems"
    layout="vertical"
    :loading
    :submitter="{
      teleport: '#teleport',
      onSubmit: handleSubmit,
    }"
  >
    <template #submitter="{ defaultDoms }">
      <component :is="defaultDoms"></component>
      <ProButton @click="handleSet">一键填写</ProButton>
      <ProButton @click="handleGet">读取姓名</ProButton>
    </template>
  </ProForm>
</template>
