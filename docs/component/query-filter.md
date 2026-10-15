---
title: ProQueryFilter 筛选表单
outline: deep
---

# ProQueryFilter 筛选表单

有些是时候表单要与别的组件组合使用，常见的有 Table ，List 等，这时候就需要一些特殊形态的表单。ProQueryFilter 解决了配合组件使用的问题，避免了复杂的样式设置。ProTable 中默认 支持了 ProQueryFilter 作为自己的筛选表单。

## 使用演示

ProQueryFilter 默认折叠状态下只展示一行表单项，点击展开后显示所有表单项，适合作为数据列表的筛选控件使用。

### 基本使用

:::demo

query-filter/basic

:::

### 默认展开

:::demo

query-filter/expand

:::

### 垂直布局

:::demo

query-filter/vertical

:::

### 隐藏按钮

:::demo

query-filter/hidden

:::

## API

ProQueryFilter 提供了与 [ProForm](./form.md) 相同的 API，以下的是 ProQueryFilter 独有的 API，同时 `ProForm` 也支持以下 API。

### Props

| 参数                      | 说明                                                                                                         | 类型                                       | 默认值    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------ | --------- |
| collapsed                 | 是否折叠超出的表单项，用于受控模式                                                                           | `boolean`                                  | -         |
| default-collapsed         | 默认状态下是否折叠超出的表单项                                                                               | `boolean`                                  | `true`    |
| label-width               | label 宽度                                                                                                   | `number` \| `'auto'`                       | -         |
| span                      | 表单项宽度，支持数字或响应式对象配置                                                                         | `number \| { xs, sm, md, lg, xl, xxl }`    | -         |
| search-text               | 搜索按钮文本                                                                                                 | `string`                                   | `'查询'`  |
| reset-text                | 重置按钮文本                                                                                                 | `string`                                   | `'重置'`  |
| ignore-rules              | 忽略所有表单项 rule                                                                                          | `boolean`                                  | -         |
| reset-on-submit           | 重置时是否执行提交                                                                                           | `boolean`                                  | `false`   |
| search-gutter             | 表单项之间的间距                                                                                             | `number`                                   | `24`      |
| show-hidden-num           | 折叠时是否显示隐藏的表单项数量                                                                               | `boolean`                                  | -         |
| default-cols-number       | 默认显示列数                                                                                                 | `number`                                   | -         |
| default-form-items-number | 自定义折叠状态下默认显示的表单控件数量，没有设置或小于 0，则显示一行控件；数量大于等于控件数量则隐藏展开按钮 | `number`                                   | -         |
| preserve                  | 表单卸载后是否保留字段值                                                                                     | `boolean`                                  | `true`    |

### Events

| 事件名         | 说明                             | 类型                                      |
| -------------- | -------------------------------- | ----------------------------------------- |
| collapse       | 切换表单折叠状态时的回调         | `(collapsed: boolean) => void`            |
| resize         | 宽高变化时的回调                 | `(width: number, height: number) => void` |
| finish         | 提交表单且数据验证成功后回调事件 | `(values: T) => Promise<void \| void>`     |
| init           | 表单初始化后回调事件             | `(values: any, action: ProFormActionType) => void` |
| reset          | 点击重置按钮的回调               | `() => void`                              |
| finish-failed  | 提交表单且数据验证失败后回调事件 | `({ values, errorFields }) => void`       |
| values-change  | 表单字段值变化时的回调           | `(values: any) => void`                   |
| loading-change | 加载动画变化后的回调事件         | `(loading: boolean) => void`              |

### Slots

| 插槽名    | 说明       | 类型                           |
| --------- | ---------- | ------------------------------ |
| submitter | 提交按钮区 | `{ props, action, defaultDoms }` |

### 响应式断点规则

注意，断点的值均为表单容器的大小而非视口大小。

#### 默认布局时的规则

| 容器宽度断点          | 单行展示表单列数（包含操作区域） | 默认布局     |
| --------------------- | -------------------------------- | ------------ |
| `≧ 1352px`            | 4 列                             | `horizontal` |
| `≧ 1062px`            | 3 列                             | `horizontal` |
| `≧ 701px && < 1063px` | 3 列                             | `horizontal` |
| `≧ 701px && < 1063px` | 3 列                             | `horizontal` |
| `≧ 513px && < 701px`  | 2 列                             | `vertical`   |
| `< 513px`             | 1 列                             | `vertical`   |

#### 强制上下布局时的规则

| 容器宽度断点          | 单行展示表单列数（包含操作区域） |
| --------------------- | -------------------------------- |
| `≧ 1057px`            | 4 列                             |
| `≧ 785px && < 1057px` | 3 列                             |
| `≧ 513px && < 785px`  | 2 列                             |
| `< 513px`             | 1 列                             |
