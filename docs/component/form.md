---
title: ProForm 高级表单
outline: deep
---

# ProForm 高级表单

ProForm 是核心组件之一，高性能表单控件，自带数据域管理。包含数据录入、校验以及对应样式。解决复杂表单控件数据联动，使用配置解决大部分业务问题，使复杂功能简单化实现。ProForm 是根据 JSON Schema 来生成表单的工具。ProForm 会根据 fieldType 来映射成不同的表单项。



## 使用演示

分步表单、Modal 表单、Drawer 表单、查询表单等多种 layout 可以覆盖大部分的使用场景，让我们脱离复杂而且繁琐的表单布局工作，用更少的代码完成更多的功能。

:::demo

form/basic

:::

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| colon | 配置 Form.Item 的 colon 的默认值 (只有在属性 layout 为 horizontal 时有效) | `boolean` | `true` |
| disabled | 设置全部表单项禁用，表单项单独配置优先级更高 | `boolean` | `false` |
| hideRequired-mark | 隐藏所有表单项的必选标记 | `boolean` | `false` |
| label-align | label 标签的文本对齐方式 | `left` \| `right` | `'right'` |
| label-col | label 标签布局，[Antv Col](https://www.antdv.com/components/grid-cn/#col) 的所有属性，设置 `span` `offset` 值，如 `{span: 3, offset: 12}` 或 `sm: {span: 3, offset: 12}` | `ColProps` | - |
| label-wrap | label 标签的文本换行方式 | `boolean` | `false` |
| layout | 表单布局 | `horizontal`\|`vertical` | `'horizontal'` |
| form-key | 表单key，默认不需要配置，系统自动递增 | `string` | - |
| wrapper-col | 需要为输入控件设置布局样式时，使用该属性，用法同 labelCol | `ColProps` | - |
| loading | 表单受控加载动画，默认表单内部控制，提交表单时触发 | `boolean` | - |
| submit-on-loading | 提交时是否显示加载动画(包含表单主体、提交按钮) | `boolean` | `true` |
| show-loading | 是否显示加载动画(包含提交、加载初始值) | `boolean` | `true` |
| omit-nil | ProForm 会自动清空 null 和 undefined 的数据，如果你约定了 nil 代表某种数据，可以设置为 false 关闭此功能 | `boolean` | `true` |
| readonly | 设置全部表单项只读，表单项单独配置优先级更高 | `boolean` | `false` |
| readonly-props | 全部只读表单项的配置，与表单项单独配置合并处理  | `{ tooltip?: boolean \| string; copy?: boolean; emptyText?: string; ellipsis?: boolean; autoLine?: boolean}` | `{ emptyText: '-', ellipsis: true }` |
| grid | 表单布局的栅格化，基于行（row）和列（col）来定义信息区块的外部框架 | `boolean` | `false` |
| col-props |在开启 grid 模式时传递给 Col，表单项单独配置优先级更高，支持[Antv Col](https://www.antdv.com/components/grid-cn/#col) 的所有属性  | `ColProps` | `{ xs: 24 }` |
| row-props |在开启 grid 模式时传递给 Row，表单项(group、formList、formSet)单独配置优先级更高，支持[Antv Row](https://www.antdv.com/components/grid-cn/#row) 的所有属性  | `RowProps` | `{ gutter: 16 }` |
| initial-values | 表单默认值，只有初始化以及重置时生效 | `object` | - |
| request | 获取表单默认值的网络请求，返回值会和`initialValues`合并 | `(params)=>Promise<data>` | - |
| params | 用于 request 查询的额外参数，变化不会触发重新加载 | `object` | - |
| request-abort | 终止网络请求，初始化有效 | `boolean` | `false` |
| submitter | 提交按钮相关配置	 | `boolean` \| `SubmitterProps` | `true` |
| items | 表单的定义，一般是 json 对象，如果是分步表单，需要使用 json 数组来生成多个表单 | `ProFormItemType` \| `ProFormItemType[]` |`[]` |
| layout-type | 使用的表单布局模式 | `Form` \| `DrawerForm` \| `ModalForm` \| `QueryFilter` \| `StepForm` | `'Form'` |

### Events

| 事件名     | 说明          | 类型                  |
| ---------- | ------------- | --------------------- |
| init | 表单初始化后回调事件 | `(values, action)=> void` |
| finish | 提交表单且数据验证成功后回调事件 | `(values)=>Promise<void> ｜ void` |
| reset | 点击重置按钮的回调 | `(e)=>void` |
| finish-failed | 提交表单且数据验证失败后回调事件 | `({ values, errorFields })=>void` |
| values-change | 提交表单且数据验证失败后回调事件 | `(values)=>void` |
| loading-change | 加载动画变化后的回调事件 | `(loading)=>void` |

### Slots

| 插槽名      | 说明           | 类型                                                                 |
| ----------- | -------------- | -------------------------------------------------------------------- |
| submitter     | 提交按钮       | `{props, action, defaultDoms}` |

### Exposes

| 名称  | 说明         | 类型       |
| ----- | ------------ | ---------- |
| getFieldValue | 获取对应字段名的值 | `(name: NamePath) => any	` |
| getFieldsValue | 获取一组字段名对应的值，会按照对应结构返回。默认返回现存字段值，当调用 getFieldsValue(true) 时返回所有值 | `(nameList?: true \| NamePath[]) => object` |
| resetInitialValues | 重新设置表单默认值 | `(values: object) => void` |
| getFieldFormatValue | 获取格式化之后的单个数据 | `(name: NamePath) => any` |
| getFieldFormatValueObject | 获取格式化之后的单个数据 | `(name: NamePath) => object` |
| validateFieldsReturnFormatValue | 验字段后返回格式化之后的所有数据 | `(nameList?: NamePath[]) => Promise<object>` |
| setFieldValue | 设置单个表单项的值 | `(name: NamePath, value: any) => void` |
| setFieldsValue | 设置表单的值 | ` (values: object, isMerge?: boolean = true) => void` |
| resetField | 重置字段到 initialValue，并清除验证信息 | `(name: NamePath) => void` |
| clearValidate | 移除表单项的校验结果。传入待移除的表单项的 name 属性或者 name 组成的数组，如不传则移除整个表单的校验结果 | `(nameList?: NamePath[]) => void	` |
| validateFields | 触发表单验证	 | `(nameList?: NamePath[]) => Promise` |
| reset | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果 | `() => void` |
| submit | 提交表单，与点击 `submit` 按钮效果相同 | `() => void` |