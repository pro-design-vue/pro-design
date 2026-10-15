## 基本表单

```vue
<script setup lang="tsx">
import { ProForm, ProFieldType, type ProFormItemType } from 'pro-design-vue'
import type { ProFormActionType } from 'pro-design-vue'

const formRef = ref<ProFormActionType>()

const formItems: ProFormItemType[] = [
  {
    fieldType: ProFieldType.GROUP,
    children: [
      {
        name: 'name',
        title: '签约客户名称',
        width: 'md',
        tooltip: '最长为 24 位',
        placeholder: '请输入名称',
        formItemProps: { required: true },
        fieldProps: { maxlength: 24 },
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
    name: 'count',
    title: '人数',
    width: 'lg',
    fieldType: ProFieldType.DIGIT,
  },
  {
    name: 'createTime',
    title: '合同生效时间',
    width: 'md',
    fieldType: ProFieldType.DATE,
  },
  {
    name: 'useMode',
    title: '合同约定生效方式',
    width: 'xs',
    fieldType: ProFieldType.SELECT,
    options: [
      { value: 'chapter', label: '盖章后生效' },
      { value: 'sign', label: '签字后生效' },
    ],
  },
  {
    name: 'address',
    title: '详细地址',
    fieldType: ProFieldType.TEXTAREA,
  },
  {
    name: 'areaList',
    title: '区域',
    width: 'md',
    fieldType: ProFieldType.CASCADER,
    request: async () => [
      {
        value: 'zhejiang',
        label: '浙江',
        children: [
          { value: 'hangzhou', label: '杭州', children: [{ value: 'xihu', label: '西湖' }] },
        ],
      },
    ],
  },
]

const handleFinish = async (val: Record<string, any>) => {
  console.log(val)
}
</script>

<template>
  <ProForm ref="formRef" :items="formItems" layout="vertical" @finish="handleFinish" />
</template>
```

## 栅格布局

```vue
<script setup lang="ts">
import { ProForm, ProFieldType, type ProFormItemType } from 'pro-design-vue'

const formItems: ProFormItemType[] = [
  { name: 'name', title: '姓名', width: 'md' },
  { name: 'age', title: '年龄', width: 'xs', fieldType: ProFieldType.DIGIT },
  { name: 'email', title: '邮箱', width: 'md' },
  { name: 'phone', title: '电话', width: 'md' },
]
</script>

<template>
  <ProForm :items="formItems" grid />
</template>
```

## 表单联动

```vue
<script setup lang="ts">
import { ProForm, ProFieldType, type ProFormItemType } from 'pro-design-vue'

const formItems: ProFormItemType[] = [
  {
    name: 'type',
    title: '类型',
    fieldType: ProFieldType.SELECT,
    width: 'md',
    initialValue: 'a',
    options: [
      { value: 'a', label: '类型A' },
      { value: 'b', label: '类型B' },
    ],
  },
  {
    name: 'name',
    title: '名称',
    width: 'md',
    // 当 type 为 'b' 时禁用
    disabled: (formData) => formData.type === 'b',
  },
  {
    name: 'address',
    title: '地址',
    fieldType: ProFieldType.TEXTAREA,
    // 使用 linkage 配置联动
    linkage: {
      hidden: (value, formData) => (formData.type === 'a' ? ['address'] : []),
    },
  },
]
</script>

<template>
  <ProForm :items="formItems" layout="vertical" />
</template>
```

## 远程数据加载

```vue
<script setup lang="ts">
import { ProForm, ProFieldType, type ProFormItemType } from 'pro-design-vue'

const formItems: ProFormItemType[] = [
  {
    name: 'name',
    title: '名称',
    width: 'md',
  },
  {
    name: 'categoryId',
    title: '分类',
    fieldType: ProFieldType.SELECT,
    width: 'md',
    request: async (params) => {
      // params 包含 dependencies 映射的值
      return [
        { value: '1', label: '分类1' },
        { value: '2', label: '分类2' },
      ]
    },
  },
]

const fetchDetail = async (params: Record<string, any>) => {
  // 从后端获取详情
  return { name: 'Pro Design', categoryId: '1' }
}
</script>

<template>
  <ProForm :items="formItems" :request="fetchDetail" :params="{ id: '100' }" />
</template>
```

## 自定义渲染

```vue
<script setup lang="tsx">
import { ProForm, type ProFormItemType } from 'pro-design-vue'

const formItems: ProFormItemType[] = [
  {
    name: 'custom',
    title: '自定义控件',
    // 使用 renderFormItem 自定义渲染表单项内部控件
    renderFormItem: ({ value, onChange }) => {
      return <a-input v-model:value={value} onChange={onChange} placeholder="自定义输入" />
    },
  },
  {
    name: 'fullRender',
    // render 可以完全自定义，包含 label 和整个表单项
    render: ({ formData }) => {
      return <div>当前表单值: {JSON.stringify(formData)}</div>
    },
  },
]
</script>

<template>
  <ProForm :items="formItems" layout="vertical" />
</template>
```
