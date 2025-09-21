---
title: ProQueryFilter 筛选表单
outline: deep
---

# ProQueryFilter 筛选表单

有些是时候表单要与别的组件组合使用，常见的有 Table ，List 等，这时候就需要一些特殊形态的表单。ProQueryFilter 解决了配合组件使用的问题，避免了复杂的样式设置。ProTable 中默认 支持了 ProQueryFilter 作为自己的筛选表单。

## 使用演示

ProModalForm 和 ProDrawerForm 都提供了 `trigger插槽` 来减少 state 的使用，如果你需要使用 state 来控制可以使用 `open` 来控制打开与关闭。

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

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| collapsed| 是否折叠超出的表单项，用于受控模式	 | `boolean` | - |
| default-collapsed| 默认状态下是否折叠超出的表单项		 | `boolean` | `true` |
| label-width | label 宽度	 | `number` \| `'auto'` | 80 |
| span | 表单项宽度	 | `number[0 - 24]` | - |
| searchText | 搜索按钮文本	 | `string` | `'查询'` |
| resetText | 重置按钮文本	 | `string` | `'重置'` |
| ignore-rules | 忽略所有表单项rule	 | `boolean` | - |
| reset-on-submit| 重置时是否执行提交	| `boolean` | `false` |

### Events

| 事件名     | 说明          | 类型                  |
| ---------- | ------------- | --------------------- |
| collapse | 切换表单折叠状态时的回调	 | `(collapsed)=>void` |
| resize | 宽高变化时的回调 | `(width: number, height: number) => void` |
